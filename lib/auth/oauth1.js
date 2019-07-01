const util = require('../util')
const { InvalidError } = require('../error')

const Location = Object.freeze({
  Address: 0,
  Body: 1,
  Header: 2
})

class Oauth1Auth {
  constructor (settings, feature) {
    const params = settings.parameters()
    validate(params)
    this.imports = new Map()
      .set('OAuth', './libs/oauth-1.0a.js')
      .set('hmac', { base: 'k6/crypto' })
    const lines = []

    // Values
    const location = getLocation(params, feature)
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
    lines.push(`const options = {
${util.indent(options.join(`,\n`))}
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
${util.indent(data.join(`,\n`))}
}`)
    }
    lines.push(`const request = {
${util.indent(request.join(`,\n`))}
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
${util.indent(token.join(`,\n`))}
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
  return (value ? util.evalString(value) : null)
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

function validate (params) {
  if (!(
    params.has('signatureMethod') &&
    params.has('consumerKey') &&
    params.has('consumerSecret') &&
    params.has('token') &&
    params.has('tokenSecret')
  )) {
    throw new InvalidError(
      { name: 'InvalidOAuth1' },
      'To convert this collection provide OAuth credentials. ' +
      'Either include them in the collection or use the --oauth1-* CLI ' +
      'options. Minimum required configuration is signature method, ' +
      'consumer key, consumer secret, access token, and token secret.'
    )
  }
}

module.exports = Oauth1Auth
