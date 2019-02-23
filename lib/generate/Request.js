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
  const feature = {
    method: request.method.toLowerCase(),
    address: new URI(request.url.toString()),
    headers: {},
    data: null,
    post: []
  }
  const { address, headers } = feature

  result.imports.set('http', 'k6/http')
  block.declares.add('res')
  if (!address.protocol()) address.protocol('http')
  request.headers.each(header => { headers[header.key] = header.value })
  if (request.auth) authentication(request.auth, feature)

  // read body
  var bodyData = request.body[request.body.mode]
  if (bodyData) {
    if (request.body.mode === postman.RequestBody.MODES.raw) {
      feature.data = escape.bodyData(bodyData)
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

      feature.data = params.join('&')
    }
  }

  render(feature, result, block)
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
  Object.assign(feature.headers, auth.headers)
}

function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

function render (feature, result, block) {
  const { method } = feature
  var url = feature.address.toString()
  var headers = feature.headers
  var tmpVariables

  tmpVariables = getVariables(url)
  for (const name of tmpVariables) result.vars.set(name, undefined)
  url = replaceCurlyBrackets(url)

  let request = ``
  if (METHODS.has(method)) request += `res = http.${method}("${url}"`
  else request += `res = http.request("${method}","${url}"`

  if (feature.data) request += `, "${feature.data}"`
  else if (Object.keys(headers).length && method !== 'get') request += `, null`

  if (Object.keys(headers).length) {
    headers = JSON.stringify(headers)
    tmpVariables = getVariables(headers)
    for (const name of tmpVariables) result.vars.set(name, undefined)
    headers = replaceCurlyBrackets(headers)
    request += `, { headers: ${headers} }`
  }

  request += `);`
  block.main.push(request)
  block.main.push(...feature.post)
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
