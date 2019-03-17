const Auth = require('../auth')
const URI = require('urijs')
const util = require('../util')
const { InheritAuth } = require('../sym')
const { readAuth } = require('../common')
const { BodyMode } = require('../enum')

function Request (name, request, result, block) {
  const feature = {
    method: request.method.toUpperCase(),
    address: null,
    headers: new Map(),
    headerSpread: new Set(),
    dataSpread: new Set(),
    data: null,
    options: new Map(),
    setup: [],
    pre: [],
    auth: null,
    post: []
  }
  address(request.url, feature)
  data(request, feature)
  headers(request.headers, feature)
  authentication(request.auth, feature, result, block)
  render(name, feature, result, block)
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

function authentication (direct, feature, result, block) {
  const auths = [ ...block.auths ]
  readAuth(direct, auths)
  const settings = selectAuth(auths)
  if (!settings) {
    return
  }
  if (!util.validAuth(settings.type)) {
    authInvalid(settings, feature)
    return
  }
  const auth = new Auth[settings.type](settings, feature)
  applyAuth(auth, feature, result, block)
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
  if (auth.setup) {
    authSetup(auth, feature)
  }
  if (auth.logic) {
    authLogic(auth, feature)
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
function authSetup (auth, feature) {
  feature.setup.push(...auth.setup)
}
function authLogic (auth, feature) {
  feature.auth = auth.logic
}
function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

function render (name, feature, result, block) {
  const config = renderConfig(name, feature)
  if (feature.setup.length) {
    block.main.push(feature.setup.join(`\n`))
  }
  block.main.push(`postman[Request](${config})`)
}

function renderConfig (name, feature) {
  const items = []
  items.push(`name: ${JSON.stringify(name)}`)
  items.push(`method: ${JSON.stringify(feature.method)}`)
  items.push(`address: ${renderAddress(feature.address)}`)
  const data = renderData(feature.data, feature.dataSpread)
  if (data) {
    items.push(`data: ${data}`)
  }
  const headers = renderHeaders(feature.headers, feature.headerSpread)
  if (headers) {
    items.push(`headers: ${headers}`)
  }
  const options = renderOptions(feature.options)
  if (options) {
    items.push(`options: ${options}`)
  }
  renderLogic(items, feature)
  return `{
${util.indent(items.join(`,\n`))}
}`
}

function renderLogic (items, feature) {
  const pre = renderPre(feature.pre)
  if (pre) {
    items.push(pre)
  }
  const post = renderPost(feature.post)
  if (post) {
    items.push(post)
  }
  const auth = renderAuth(feature.auth)
  if (auth) {
    items.push(auth)
  }
}

function renderPre (pre) {
  if (pre.length) {
    return `pre() {
${util.indent(pre.join(`\n`))}
}`
  } else {
    return null
  }
}

function renderPost (post) {
  if (post.length) {
    return `post(response) {
${util.indent(post.join(`\n`))}
}`
  } else {
    return null
  }
}

function renderAuth (auth) {
  if (auth) {
    return `auth(config, Var) {
${util.indent(auth)}
}`
  } else {
    return null
  }
}

function renderAddress (address) {
  if (typeof address === 'string') {
    return address
  } else {
    return JSON.stringify(address.toString())
  }
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
  if (!options.size) {
    return null
  }
  const items = []
  for (const [ key, value ] of options) {
    items.push(`${key}: ${JSON.stringify(value)}`)
  }
  return `{
${util.indent(items.join(`,\n`))}
}`
}

function renderHeaders (headers, spread) {
  if (!(headers.size || spread.size)) {
    return null
  }
  const directHeaders = renderDirectHeaders(headers)
  const rendered = renderHeaderSpread(directHeaders, [ ...spread ])
  return rendered
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
      return JSON.stringify(spec.value)
    }
  } else {
    return JSON.stringify(spec)
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

module.exports = Request
