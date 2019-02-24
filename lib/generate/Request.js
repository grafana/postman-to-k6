const Auth = require('../auth')
const escape = require('../escape')
const postman = require('postman-collection')
const URI = require('urijs')
const util = require('../util')

const METHOD = new Set([
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
    address: null,
    headers: new Map(),
    data: null,
    post: []
  }

  result.imports.set('http', 'k6/http')
  block.declares.add('res')
  address(request.url, feature)
  headers(request.headers, feature)
  authentication(request.auth, feature)

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

function address (address, feature) {
  feature.address = new URI(address.toString())
  if (!feature.address.protocol()) feature.address.protocol('http')
}

function headers (headers, feature) {
  headers.each(({ name, value }) => { feature.headers.set(name, value) })
}

function authentication (settings, feature) {
  if (!settings) return
  if (util.validAuth(settings.type)) authValid(settings, feature)
  else authInvalid(settings, feature)
}

function authValid (settings, feature) {
  const auth = new Auth[settings.type](settings)
  if (auth.headers) authHeaders(auth, feature)
}

function authHeaders (auth, feature) {
  for (const [ name, value ] of auth.headers) feature.headers.set(name, value)
}

function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

function render (feature, result, block) {
  const { method } = feature
  var url = feature.address.toString()
  var tmpVariables

  tmpVariables = getVariables(url)
  for (const name of tmpVariables) result.vars.set(name, undefined)
  url = replaceCurlyBrackets(url)

  let request = ``
  if (METHOD.has(method)) request += `res = http.${method}("${url}"`
  else request += `res = http.request("${method}","${url}"`

  if (feature.data) request += `, "${feature.data}"`
  else if (feature.headers.size && method !== 'get') request += `, null`

  if (feature.headers.size) {
    const rendered = renderHeaders(feature.headers)
    request += `, { headers: ${rendered} }`
  }

  request += `);`
  block.main.push(request)
  block.main.push(...feature.post)
}

function renderHeaders (headers) {
  const rendered = []
  for (const item of headers) {
    const key = util.evalKey(item[0])
    const value = util.evalString(item[1])
    rendered.push(`${key}: ${value}`)
  }
  return `{
${util.indent(rendered.join(`,\n`))}
}`
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
