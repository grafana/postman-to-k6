const aid = require('../aid')

const Location = Object.freeze({
  Address: 0,
  Body: 1,
  Header: 2
})

class Oauth1Auth {
  constructor (settings, feature) {
    const params = settings.parameters()
    this.imports = new Map()
      .set('OAuth', './libs/oauth-1.0a.js')
      .set('hmac', { base: 'k6/crypto' })
    const lines = []

    // Values
    const location = getLocation(params, feature)
    const version = getOptional(params, 'version')
    const realm = getOptional(params, 'realm')
    const signatureMethod = params.get('signatureMethod')
    const consumerKey = aid.evalString(params.get('consumerKey'))
    const consumerSecret = aid.evalString(params.get('consumerSecret'))
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
${aid.indent(consumer.join(`,\n`))}
}`)
    options.push(`signature_method: ${JSON.stringify(signatureMethod)}`)
    renderHashFunction(signatureMethod, options)
    if (version) {
      options.push(`version: ${version}`)
    }
    if (realm) {
      options.push(`realm: ${realm}`)
    }
    lines.push(`const options = {
${aid.indent(options.join(`,\n`))}
};`)

    // Request Data
    const request = []
    request.push(`method: config.method`)
    request.push(`url: config.address`)
    const data = []
    if (timestamp) {
      data.push(`oauth_timestamp: ${timestamp}`)
    }
    if (nonce) {
      data.push(`oauth_nonce: ${nonce}`)
    }
    if (data.length) {
      request.push(`data: {
${aid.indent(data.join(`,\n`))}
}`)
    }
    lines.push(`const request = {
${aid.indent(request.join(`,\n`))}
};`)

    // Token
    const token = []
    if (tokenKey) {
      token.push(`key: ${tokenKey}`)
    }
    if (tokenSecret) {
      token.push(`secret: ${tokenSecret}`)
    }
    if (token.length) {
      lines.push(`const token = {
${aid.indent(token.join(`,\n`))}
};`)
    }

    // Sign
    lines.push(`const oauth = OAuth(options);`)
    const args = []
    args.push(`request`)
    if (token.length) {
      args.push(`token`)
    }
    switch (location) {
      case Location.Header:
        lines.push(
          `const auth = oauth.toHeader(oauth.authorize(${args.join(`, `)}));`
        )
        break
      case Location.Body:
      case Location.Address:
        lines.push(`const auth = oauth.authorize(${args.join(`, `)});`)
        break
    }

    // Request
    switch (location) {
      case Location.Header:
        lines.push(`Object.assign(config.headers, auth);`)
        break
      case Location.Body:
        lines.push(`Object.assign(config.data, auth);`)
        break
      case Location.Address:
        this.imports.set('URI', './libs/urijs.js')
        lines.push(`const address = new URI(config.address);
for (const key of Object.keys(auth)) {
  address.addQuery(key, auth[key]);
}
config.address = address.toString();`)
        break
    }
    this.logic = lines.join(`\n`)
  }
}

function getOptional (params, key) {
  const value = params.get(key)
  return (value ? aid.evalString(value) : null)
}

function getLocation (params, feature) {
  if (params.get('addParamsToHeader')) {
    return Location.Header
  } else if (
    feature.method === 'GET' || // No body
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
