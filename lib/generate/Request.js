const escape = require('../escape')
const util = require('../util')
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

function Request (item, result, block) {
  const request = item.request
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

  result.imports.set('http', 'k6/http')
  block.declares.add('res')

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
          postRequest = `/*
${script.join(`\n`)}
*/`
        }
      } else if (event.listen === 'prerequest') {
        script = event.script.exec
        if (script.length) {
          preRequest = `/*
${script.join(`\n`)}
*/`
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
      switch (auth.type) {
        case 'awsv4':
        case 'hawk':
        case 'oauth1':
          authenticationComment =
            `Note: ${auth.type} dynamic authentication is not supported`
          break
        case 'digest':
          authenticationComment =
            `Note: ${auth.type} dynamic digest authentication is not supported`
          break
      }
      if (authenticationComment) {
        if (postRequest) postRequest += `\n`
        else postRequest = ``
        postRequest = `/*
${util.indent(authenticationComment)}
*/`
      }
    }
  }

  Object.keys(headerHash).forEach(function (key) {
    var tmpHeader = `"${key}" : "${escape.headerValue(headerHash[key])}"`
    headers.push(tmpHeader)
  })

  // read body
  var bodyData = body[body.mode]
  if (bodyData) {
    if (body.mode === RequestBodyModes.raw) {
      data = escape.bodyData(bodyData)
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
    postRequest: postRequest
  }, result, block)
}

function moduleExist (name) {
  try { return require(name) } catch (e) { return false }
}

function build (options, result, block) {
  var url = options.url
  const method = options.method.toLowerCase()
  var headers = options.headers
  var data = options.data
  var preRequest = options.preRequest
  var postRequest = options.postRequest
  var tmpVariables

  const chunk = []
  if (preRequest) chunk.push(preRequest)

  tmpVariables = getVariables(url)
  for (const name of tmpVariables) result.vars.add(name)
  url = replaceCurlyBrackets(url)

  let request = ``
  if (METHODS.has(method)) {
    request += `res = http.${method}("${completeUrlWithScheme(url)}"`
  } else {
    request += `res = http.request("${method}","${completeUrlWithScheme(url)}"`
  }

  if (data) request += `, "${data}"`
  else if (headers.length && data == null && method !== 'get') {
    request += `, null`
  }

  // request headers
  if (headers.length) {
    headers = headers.join(', ')

    tmpVariables = getVariables(headers)
    for (const name of tmpVariables) result.vars.add(name)
    headers = replaceCurlyBrackets(headers)
    request += `, { headers: { ${headers} } }`
  }

  request += `);`
  chunk.push(request)
  if (postRequest) chunk.push(postRequest)
  block.main.push(chunk)
}

function getVariables (input) {
  if (input) {
    var matches = input.match(/{{(.*?)}}/g)
    if (matches) {
      return matches.map(function (item) {
        return item.replace(/{{/g, '').replace(/}}/g, '')
      })
    } else return []
  } else return []
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

module.exports = Request
