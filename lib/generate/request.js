const METHODS = new Set([
  'batch',
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put'
])

function request (options) {
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

module.exports = request
