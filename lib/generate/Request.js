const Auth = require('../auth')
const URI = require('urijs')
const util = require('../util')
const { InheritAuth } = require('../sym')
const { BodyMode, Method } = require('../enum')

function Request (request, result, block) {
  const feature = {
    method: request.method.toLowerCase(),
    address: null,
    headers: new Map(),
    headerSpread: new Set(),
    dataSpread: new Set(),
    data: null,
    options: new Map(),
    pre: [],
    post: []
  }
  result.imports.set('http', 'k6/http')
  block.declares.add('res')
  address(request.url, feature)
  data(request, feature)
  headers(request.headers, feature)
  authentication(request.auth, feature, result, block)
  render(feature, result, block)
}

function address (address, feature) {
  feature.address = new URI(address.toString())
  if (!feature.address.protocol()) {
    feature.address.protocol('http')
  }
}

function data (request, feature) {
  const body = request.body
  if (!body) {
    return
  }
  const mode = body.mode
  switch (mode) {
    case BodyMode.raw:
      dataRaw(body, feature)
      return
    case BodyMode.formdata:
      dataForm(body, feature)
      return
    case BodyMode.urlencoded:
      dataUrl(body, feature)
      return
    default:
      throw new Error(`Unrecognized body mode: ${mode}`)
  }
}
function dataRaw (body, feature) {
  if (body.raw) {
    feature.data = body.raw
  }
}
function dataForm (body, feature) {
  const data = {}
  const items = util.spread(body.formdata)
  for (const { key, value } of items) {
    data[key] = value
  }
  feature.data = data
}
function dataUrl (body, feature) {
  const data = {}
  const items = util.spread(body.urlencoded)
  for (const { key, value } of items) {
    data[key] = value
  }
  feature.data = data
}

function headers (headers, feature) {
  headers.each(({ key, value }) => { feature.headers.set(key, value) })
}

function authentication (settings, feature, result, block) {
  if (settings && !util.validAuth(settings.type)) {
    authInvalid(settings, feature)
    return
  }
  const directAuth = readDirectAuth(settings, feature)
  const auths = [ ...block.auths, directAuth ]
  const auth = selectAuth(auths)
  if (!auth) {
    return null
  }
  applyAuth(auth, feature, result, block)
}
function readDirectAuth (settings, feature) {
  if (settings) {
    return new Auth[settings.type](settings, feature)
  } else {
    return InheritAuth
  }
}
function selectAuth (auths) {
  for (const auth of [ ...auths ].reverse()) {
    if (auth !== InheritAuth) {
      return auth
    }
  }
  return null
}
function applyAuth (auth, feature, result, block) {
  if (auth.imports) {
    authImports(auth, result)
  }
  if (auth.declares) {
    authDeclares(auth, block)
  }
  if (auth.headers) {
    authHeaders(auth, feature)
  }
  if (auth.headerSpread) {
    authHeaderSpread(auth, feature)
  }
  if (auth.dataSpread) {
    authDataSpread(auth, feature)
  }
  if (auth.options) {
    authOptions(auth, feature)
  }
  if (auth.credential) {
    authCredential(auth, feature)
  }
  if (auth.address) {
    authAddress(auth, feature)
  }
  if (auth.pre) {
    authPre(auth, feature)
  }
}
function authImports (auth, result) {
  for (const [ name, spec ] of auth.imports) {
    result.imports.set(name, spec)
  }
}
function authDeclares (auth, block) {
  for (const declare of auth.declares) {
    block.declares.add(declare)
  }
}
function authHeaders (auth, feature) {
  for (const [ name, value ] of auth.headers) {
    feature.headers.set(name, value)
  }
}
function authHeaderSpread (auth, feature) {
  for (const item of auth.headerSpread) {
    feature.headerSpread.add(item)
  }
}
function authDataSpread (auth, feature) {
  for (const item of auth.dataSpread) {
    feature.dataSpread.add(item)
  }
}
function authOptions (auth, feature) {
  for (const [ name, value ] of auth.options) {
    feature.options.set(name, value)
  }
}
function authCredential (auth, feature) {
  feature.address
    .username(auth.credential.username)
    .password(auth.credential.password)
}
function authAddress (auth, feature) {
  feature.address = auth.address
}
function authPre (auth, feature) {
  feature.pre.push(...auth.pre)
}
function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

function render (feature, result, block) {
  block.main.push(...feature.pre)
  const shortcut = Method.has(feature.method)
  const call = `http.${shortcut ? feature.method : `request`}`
  const args = []
  if (!shortcut) {
    args.push(JSON.stringify(feature.method))
  }
  if (typeof feature.address === 'string') {
    args.push(feature.address)
  } else {
    args.push(util.evalString(feature.address.toString()))
  }
  const data = renderData(feature.data, feature.dataSpread)
  if (data) {
    args.push(data)
  } else if (feature.method !== 'get') {
    args.push(`null`)
  }
  processOptions(feature.options)
  renderHeaders(feature.headers, feature.headerSpread, feature.options)
  if (feature.options.size) {
    args.push(renderOptions(feature.options))
  }
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

function renderHeaders (headers, spread, options) {
  if (!(headers.size || spread.size)) {
    return
  }
  const directHeaders = renderDirectHeaders(headers)
  const rendered = renderHeaderSpread(directHeaders, [ ...spread ])
  options.set('headers', rendered)
}

function renderDirectHeaders (headers) {
  if (!headers.size) {
    return null
  }
  const items = []
  for (const item of headers) {
    const key = util.evalKey(item[0])
    const value = renderHeaderValue(item[1])
    items.push(`${key}: ${value}`)
  }
  return `{
${util.indent(items.join(`,\n`))}
}`
}

function renderHeaderValue (spec) {
  if (typeof spec === 'object') {
    if (spec.raw) {
      return spec.value
    } else {
      return util.evalString(spec.value)
    }
  } else {
    return util.evalString(spec)
  }
}

function renderHeaderSpread (target, spread) {
  if (!spread.length) {
    return target
  }
  const source = spread.pop()
  if (!target) {
    return renderHeaderSpread(source, spread)
  }
  return `Object.assign(${renderHeaderSpread(target, spread)}, ${source})`
}

function renderData (data, spread) {
  if (!(data || spread.size)) {
    return null
  }
  const directData = data ? JSON.stringify(data) : null
  return renderDataSpread(directData, [ ...spread ])
}

function renderDataSpread (target, spread) {
  if (!spread.length) {
    return target
  }
  const source = spread.pop()
  if (!target) {
    return renderDataSpread(source, spread)
  }
  return `Object.assign(${renderDataSpread(target, spread)}, ${source})`
}

function renderOptions (options) {
  const items = []
  for (const [ key, value ] of options) {
    items.push(`${key}: ${value}`)
  }
  return `{
${util.indent(items.join(`,\n`))}
}`
}

module.exports = Request
