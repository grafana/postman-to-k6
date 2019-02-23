const auth = require('../auth')
const escape = require('../escape')
const URI = require('urijs')
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

function Request (request, result, block) {
  var body = request.body
  var method
  var url
  var data
  var headerHash = {}
  var authHeader
  var postRequest
  var headers = []

  result.imports.set('http', 'k6/http')
  block.declares.add('res')

  // read method & url
  method = request.method
  url = new URI(request.url.toString())
  if (!url.protocol()) url.protocol('http')

  // get headers & auth into headerHash
  request.headers.each(function (header) {
    headerHash[header.key] = header.value
  })

  // add or overwrite auth header
  if (request.auth && request.auth.type) {
    if (util.validAuth(request.auth.type)) {
      if (auth[request.auth.type].enabled) {
        authHeader = auth[request.auth.type].header(request)
        if (authHeader) headerHash[authHeader.key] = authHeader.value
      }
    } else {
      postRequest = `/*
  Note: ${request.auth.type} authentication not supported
*/`
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
    url: url.toString(),
    method: method,
    headers: headers,
    data: data,
    postRequest
  }, result, block)
}

function build (options, result, block) {
  var url = options.url
  const method = options.method.toLowerCase()
  var headers = options.headers
  var data = options.data
  var postRequest = options.postRequest
  var tmpVariables

  tmpVariables = getVariables(url)
  for (const name of tmpVariables) result.vars.set(name, undefined)
  url = replaceCurlyBrackets(url)

  let request = ``
  if (METHODS.has(method)) request += `res = http.${method}("${url}"`
  else request += `res = http.request("${method}","${url}"`

  if (data) request += `, "${data}"`
  else if (headers.length && method !== 'get') request += `, null`

  // request headers
  if (headers.length) {
    headers = headers.join(', ')

    tmpVariables = getVariables(headers)
    for (const name of tmpVariables) result.vars.set(name, undefined)
    headers = replaceCurlyBrackets(headers)
    request += `, { headers: { ${headers} } }`
  }

  request += `);`
  block.main.push(request)
  if (postRequest) block.main.push(postRequest)
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

module.exports = Request
