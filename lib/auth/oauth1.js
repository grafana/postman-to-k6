const util = require('../util')

const Location = Object.freeze({
  Address: 0,
  Body: 1,
  Header: 2
})

class Oauth1Auth {
  constructor (settings, feature) {
    const params = settings.parameters()
    this.imports = new Map()
      .set('OAuth', './oauth-1.0a.js')
      .set('hmac', { base: 'k6/crypto' })
    this.declares = new Set()
      .add('options')
      .add('oauth')
      .add('request')
      .add('auth')
    this.pre = []

    // Values
    const location = getLocation(params, feature)
    const method = feature.method.toUpperCase()
    const address = util.evalString(feature.address.toString())
    const version = getOptional(params, 'version')
    const realm = getOptional(params, 'realm')
    const signatureMethod = params.get('signatureMethod')
    const consumerKey = util.evalString(params.get('consumerKey'))
    const consumerSecret = util.evalString(params.get('consumerSecret'))
    const tokenKey = getOptional(params, 'token')
    const tokenSecret = getOptional(params, 'tokenSecret')
    const timestamp = getOptional(params, 'timestamp')
    const nonce = getOptional(params, 'nonce')

    // Consumer
    const consumer = []
    consumer.push(`key: ${consumerKey}`)
    consumer.push(`secret: ${consumerSecret}`)

    // Options
    const options = []
    options.push(`consumer: {
${util.indent(consumer.join(`,\n`))}
}`)
    options.push(`signature_method: ${JSON.stringify(signatureMethod)}`)
    renderHashFunction(signatureMethod, options)
    if (version) {
      options.push(`version: ${version}`)
    }
    if (realm) {
      options.push(`realm: ${realm}`)
    }
    this.pre.push(`options = {
${util.indent(options.join(`,\n`))}
}`)

    // Request Data
    const request = []
    request.push(`method: ${JSON.stringify(method)}`)
    request.push(`url: ${address}`)
    const data = []
    if (timestamp) {
      data.push(`oauth_timestamp: ${timestamp}`)
    }
    if (nonce) {
      data.push(`oauth_nonce: ${nonce}`)
    }
    if (data.length) {
      request.push(`data: {
${util.indent(data.join(`,\n`))}
}`)
    }
    this.pre.push(`request = {
${util.indent(request.join(`,\n`))}
}`)

    // Token
    const token = []
    if (tokenKey) {
      token.push(`key: ${tokenKey}`)
    }
    if (tokenSecret) {
      token.push(`secret: ${tokenSecret}`)
    }
    if (token.length) {
      this.declares.add('token')
      this.pre.push(`token = {
${util.indent(token.join(`,\n`))}
}`)
    }

    // Sign
    this.pre.push(`oauth = OAuth(options)`)
    const args = []
    args.push(`request`)
    if (token.length) {
      args.push(`token`)
    }
    switch (location) {
      case Location.Header:
        this.pre.push(
          `auth = oauth.toHeader(oauth.authorize(${args.join(`, `)}))`
        )
        break
      case Location.Body:
      case Location.Address:
        this.pre.push(`auth = oauth.authorize(${args.join(`, `)})`)
        break
    }

    // Request
    switch (location) {
      case Location.Header:
        this.headerSpread = new Set().add('auth')
        break
      case Location.Body:
        this.dataSpread = new Set().add('auth')
        break
      case Location.Address:
        this.imports.set('URI', './urijs.js')
        this.declares.add('address')
        this.address = `address.toString()`
        this.pre.push(`address = new URI(${address});`)
        this.pre.push(`for (const key of Object.keys(auth)) {
  address.addQuery(key, auth[key]);
}`)
        break
    }
  }
}

function getOptional (params, key) {
  const value = params.get(key)
  return (value ? util.evalString(value) : null)
}

function getLocation (params, feature) {
  if (params.get('addParamsToHeader')) {
    return Location.Header
  } else if (
    feature.method === 'get' || // No body
    typeof feature.data === 'string' // Raw body
  ) {
    return Location.Address
  } else { // Structured data
    return Location.Body
  }
}

function renderHashFunction (method, options) {
  switch (method) {
    case 'HMAC-SHA1':
      options.push(`hash_function(data, key) {
  return hmac("sha1", key, data, "base64");
}`)
      break
    case 'HMAC-SHA256':
      options.push(`hash_function(data, key) {
  return hmac("sha256", key, data, "base64");
}`)
      break
    case 'PLAINTEXT':
      break
    default:
      throw new Error(`Unrecognized OAuth 1.0 signature method: ${method}`)
  }
}

module.exports = Oauth1Auth
