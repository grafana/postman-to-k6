const Auth = require('../auth')
const escape = require('../escape')
const URI = require('urijs')
const util = require('../util')
const { BodyMode, Method } = require('../enum')

function Request (request, result, block) {
  const feature = {
    method: request.method.toLowerCase(),
    address: null,
    headers: new Map(),
    data: null,
    options: new Map(),
    post: []
  }
  result.imports.set('http', 'k6/http')
  block.declares.add('res')
  address(request.url, feature)
  headers(request.headers, feature)
  authentication(request.auth, feature)
  data(request, feature)
  render(feature, result, block)
}

function address (address, feature) {
  feature.address = new URI(address.toString())
  if (!feature.address.protocol()) feature.address.protocol('http')
}

function headers (headers, feature) {
  headers.each(({ key, value }) => { feature.headers.set(key, value) })
}

function authentication (settings, feature) {
  if (!settings) return
  if (util.validAuth(settings.type)) authValid(settings, feature)
  else authInvalid(settings, feature)
}

function authValid (settings, feature) {
  const auth = new Auth[settings.type](settings)
  if (auth.headers) authHeaders(auth, feature)
  if (auth.options) authOptions(auth, feature)
  if (auth.credential) authCredential(auth, feature)
}

function authHeaders (auth, feature) {
  for (const [ name, value ] of auth.headers) feature.headers.set(name, value)
}

function authOptions (auth, feature) {
  for (const [ name, value ] of auth.options) feature.options.set(name, value)
}

function authCredential (auth, feature) {
  feature.address.username(auth.credential.username)
  feature.address.password(auth.credential.password)
}

function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

function data (request, feature) {
  var bodyData = request.body[request.body.mode]
  if (bodyData) {
    if (request.body.mode === BodyMode.raw) {
      feature.data = escape.bodyData(bodyData)
    } else if (bodyData.count() > 0) {
      // body.mode === BodyMode.formdata
      // body.mode === BodyMode.urlencoded
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
}

function render (feature, result, block) {
  const shortcut = Method.has(feature.method)
  const call = `http.${shortcut ? feature.method : `request`}`
  const args = []
  if (!shortcut) args.push(JSON.stringify(feature.method))
  args.push(util.evalString(feature.address.toString()))
  if (feature.data) args.push(`"${feature.data}"`)
  else if (feature.headers.size && feature.method !== 'get') args.push(`null`)
  processOptions(feature.options)
  renderHeaders(feature.headers, feature.options)
  if (feature.options.size) args.push(renderOptions(feature.options))
  block.main.push(`res = ${call}(
${util.indent(args.join(`,\n`))}
);`)
  block.main.push(...feature.post)
}

function processOptions (options) {
  for (const item of options) {
    const key = item[0]
    const value = JSON.stringify(item[1])
    options.set(key, value)
  }
}

function renderHeaders (headers, options) {
  if (!headers.size) return
  const items = []
  for (const item of headers) {
    const key = util.evalKey(item[0])
    const value = util.evalString(item[1])
    items.push(`${key}: ${value}`)
  }
  const rendered = `{
${util.indent(items.join(`,\n`))}
}`
  options.set('headers', rendered)
}

function renderOptions (options) {
  const items = []
  for (const [ key, value ] of options) items.push(`${key}: ${value}`)
  return `{
${util.indent(items.join(`,\n`))}
}`
}

module.exports = Request
