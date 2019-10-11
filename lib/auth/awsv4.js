const aid = require('../aid')

class Aws4Auth {
  constructor (settings, feature) {
    const params = settings.parameters()
    this.polyfills = new Set()
      .add('spo-gpo')
    this.imports = new Map()
      .set('URI', './libs/urijs.js')
      .set('aws4', './libs/aws4.js')
    const lines = []

    // Address
    lines.push(`const address = new URI(config.address);`)

    // Options
    const options = []
    options.push(`method: ${JSON.stringify(feature.method)}`)
    options.push(`protocol: address.protocol()`)
    options.push(`hostname: address.hostname()`)
    options.push(`port: address.port()`)
    options.push(`path: address.path() + address.search()`)
    if (params.has('region')) {
      const region = aid.evalString(params.get('region'))
      options.push(`region: ${region}`)
    }
    if (params.has('service')) {
      const service = aid.evalString(params.get('service'))
      options.push(`service: ${service}`)
    }
    lines.push(`const options = {
${aid.indent(options.join(`,\n`))}
};`)

    // Credential
    const credential = []
    {
      const accessKey = aid.evalString(params.get('accessKey'))
      credential.push(`accessKeyId: ${accessKey}`)
    }
    {
      const secretKey = aid.evalString(params.get('secretKey'))
      credential.push(`secretAccessKey: ${secretKey}`)
    }
    if (params.has('sessionToken')) {
      const sessionToken = aid.evalString(params.get('sessionToken'))
      credential.push(`sessionToken: ${sessionToken}`)
    }
    lines.push(`const credential = {
${aid.indent(credential.join(`,\n`))}
};`)

    // Sign
    lines.push(`const signed = aws4.sign(options, credential);`)

    // Request
    lines.push(`const [path, query] = signed.path.split("?");
config.address = new URI()
  .protocol(address.protocol())
  .hostname(signed.hostname)
  .path(path)
  .query(query)
  .toString();`)
    lines.push(`Object.assign(config.headers, signed.headers);`)
    this.logic = lines.join(`\n`)
  }
}

module.exports = Aws4Auth
