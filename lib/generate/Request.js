const { escapeContent } = require('../helper')
const {
  RequestBody: { MODES: RequestBodyModes }
} = require('postman-collection')

const METHODS = new Set([
  'batch',
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put'
])

function generateRequest (item) {
  var request = item.request
  var body = request.body
  var method
  var url
  var data
  var postRequest
  var preRequest
  var auth = request.auth
  var headerHash = {}
  var authHeader
  var headers = []

  // read method & url
  method = request.method
  url = request.url.toString()

  // read test and preRequest functions
  if (item.events.count() > 0) {
    item.events.each(function (event) {
      var script
      if (event.listen === 'test') {
        script = event.script.exec
        if (script.length) {
          // js commented
          postRequest = `\n    /**\n    ${script.join('\n    ')}\n    **/\n`
        }
      } else if (event.listen === 'prerequest') {
        script = event.script.exec
        if (script.length) {
          // js commented
          preRequest = `\n    /**\n    ${script.join('\n    ')}\n    **/\n`
        }
      }
    })
  }

  // get headers & auth into headerHash
  request.headers.each(function (header) {
    headerHash[header.key] = header.value
  })

  // add or overwrite auth header
  if (auth && auth.type) {
    var AuthenticationManager = moduleExist('../auth/' + auth.type)
    if (AuthenticationManager && AuthenticationManager.enabled) {
      authHeader = AuthenticationManager.header(request)
      if (authHeader) headerHash[authHeader.key] = authHeader.value
    } else {
      var authenticationComment
      if (auth.type === 'awsv4' || auth.type === 'hawk' || auth.type === 'oauth1') {
        authenticationComment =
          `Note: ${auth.type} dynamic authentication is not supported`
      } else if (auth.type === 'digest') {
        authenticationComment =
          `Note: ${auth.type} dynamic digest authentication is not supported`
      }

      if (authenticationComment) {
        postRequest = postRequest || ''
        postRequest += `    /** \n    ${authenticationComment}\n    **/\n`
      }
    }
  }

  Object.keys(headerHash).forEach(function (key) {
    var tmpHeader = `"${key}" : "${escapeContent(headerHash[key])}"`
    headers.push(tmpHeader)
  })

  // read body
  var bodyData = body[body.mode]
  if (bodyData) {
    if (body.mode === RequestBodyModes.raw) {
      data = escapeContent(bodyData)
    } else if (bodyData.count() > 0) {
      // body.mode === RequestBodyModes.formdata
      // body.mode === RequestBodyModes.urlencoded
      // should we add default CONTENT-TYPE Header `application/x-www-form-urlencoded`?

      var params = []
      bodyData.each(function (paramItem) {
        const item = [
          encodeURIComponent(paramItem.key),
          encodeURIComponent(paramItem.value)
        ].join('=')
        params.push(item)
      })

      data = params.join('&')
    }
  }

  return build({
    url: url,
    method: method,
    headers: headers,
    data: data,
    preRequest: preRequest,
    postRequest: postRequest,
    variable: 'res'
  })
}

function moduleExist (name) {
  try { return require(name) } catch (e) { return false }
}

function build (options) {
  var url = options.url
  const method = options.method.toLowerCase()
  var headers = options.headers
  var data = options.data
  var preRequest = options.preRequest
  var postRequest = options.postRequest
  var variable = options.variable
  var variables = []
  var tmpVariables
  var result = ''

  if (preRequest) result += `    ${preRequest}`
  if (variable) result += `    ${variable} = `
  tmpVariables = getVariables(url)
  if (tmpVariables) variables = variables.concat(tmpVariables)
  url = replaceCurlyBrackets(url)

  if (METHODS.has(method)) {
    result += `http.${method}("${completeUrlWithScheme(url)}"`
  } else {
    result += `http.request("${method}","${completeUrlWithScheme(url)}"`
  }

  // request data
  if (data) result += `,\n      "${data}"`
  else if (headers.length && data == null && method.toLowerCase() !== 'get') {
    result += ',\n      null'
  }

  // request headers
  if (headers.length) {
    headers = headers.join(', ')

    tmpVariables = getVariables(headers)
    if (tmpVariables) {
      variables = variables.concat(tmpVariables)
    }
    headers = replaceCurlyBrackets(headers)
    result += `,\n      { headers: { ${headers} } }`
  }

  result += ');\n'
  if (postRequest) result += `${postRequest}`

  return {
    result: result,
    variables: variables
  }
}

function getVariables (input) {
  if (input) {
    var matches = input.match(/{{(.*?)}}/g)
    if (matches) {
      return matches.map(function (item) {
        return item.replace(/{{/g, '').replace(/}}/g, '')
      })
    }
  }
}

function replaceCurlyBrackets (input) {
  return input.replace(/{{/g, '"+').replace(/}}/g, '+"')
}

// Complete a schemeless url
function completeUrlWithScheme (url) {
  if (url.match('^http(s?)://')) {
    return url
  } else if (url.match('^//')) {
    return 'http:' + url
  }
  return 'http://' + url
}

module.exports = generateRequest
