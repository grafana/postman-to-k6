const Auth = require('../auth')
const escape = require('../escape')
const postman = require('postman-collection')
const URI = require('urijs')
const util = require('../util')

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
  var data
  const feature = {
    address: new URI(request.url.toString()),
    headerHash: {},
    headers: [],
    post: []
  }
  const { address, headerHash, headers } = feature

  result.imports.set('http', 'k6/http')
  block.declares.add('res')
  if (!address.protocol()) address.protocol('http')

  // get headers & auth into headerHash
  request.headers.each(function (header) {
    headerHash[header.key] = header.value
  })
  if (request.auth) authentication(request.auth, feature)

  Object.keys(headerHash).forEach(function (key) {
    var tmpHeader = `"${key}" : "${escape.headerValue(headerHash[key])}"`
    headers.push(tmpHeader)
  })

  // read body
  var bodyData = body[body.mode]
  if (bodyData) {
    if (body.mode === postman.RequestBody.MODES.raw) {
      data = escape.bodyData(bodyData)
    } else if (bodyData.count() > 0) {
      // body.mode === postman.RequestBody.MODES.formdata
      // body.mode === postman.RequestBody.MODES.urlencoded
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

  build({
    method: request.method,
    data: data
  }, feature, result, block)
  block.main.push(...feature.post)
}

function authentication (settings, feature) {
  if (util.validAuth(settings.type)) authValid(settings, feature)
  else authInvalid(settings, feature)
}

function authValid (settings, feature) {
  const auth = new Auth[settings.type](settings)
  if (auth.headers) authHeaders(auth, feature)
}

function authHeaders (auth, feature) {
  for (const key of Object.keys(auth.headers)) {
    const value = auth.headers[key]
    feature.headerHash[key] = value
  }
}

function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

function build (options, feature, result, block) {
  var url = feature.address.toString()
  const method = options.method.toLowerCase()
  var headers = feature.headers
  var data = options.data
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
