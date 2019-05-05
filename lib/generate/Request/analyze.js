const aid = require('../../aid')
const Auth = require('../../auth')
const URI = require('urijs')
const { InheritAuth } = require('../../sym')
const { readAuth } = require('../../common')
const { BodyMode } = require('../../enum')

function analyze (request, result, block) {
  const feature = {
    method: request.method.toUpperCase(),
    address: null,
    headers: new Map(),
    headerSpread: new Set(),
    dataSpread: new Set(),
    data: null,
    options: new Map(),
    pre: [],
    auth: null,
    post: []
  }
  if (block.pre) {
    feature.pre.push(block.pre)
  }
  if (block.post) {
    feature.post.push(block.post)
  }
  address(request.url, feature)
  data(request, feature)
  headers(request.headers, feature)
  authentication(request.auth, feature, result, block)
  return feature
}

function address (address, feature) {
  feature.address = new URI(address.toString())
  if (!feature.address.protocol()) {
    feature.address.protocol('http')
  }
}

function data (request, feature) {
  const body = request.body
  if (!body || !body.mode) {
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
  const items = aid.spread(body.formdata)
  for (const { key, value } of items) {
    data[key] = value
  }
  feature.data = data
}
function dataUrl (body, feature) {
  const data = {}
  const items = aid.spread(body.urlencoded)
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
  if (!aid.validAuth(settings.type)) {
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
function authLogic (auth, feature) {
  feature.auth = auth.logic
}
function authInvalid (settings, feature) {
  const message = `/* Note: ${settings.type} authentication not supported */`
  feature.post.push(message)
}

module.exports = analyze