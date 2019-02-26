const util = require('../util')

class Aws4Auth {
  constructor (settings, feature) {
    const params = settings.parameters()
    this.imports = new Map()
      .set(
        'URI',
        'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.1/URI.min.js'
      )
      .set('aws4', './aws4.js')
    this.declares = new Set()
      .add('address')
      .add('options')
      .add('credential')
      .add('signed')
    this.pre = []

    // Address
    {
      const address = util.evalString(feature.address.toString())
      this.pre.push(`address = new URI(${address})`)
    }

    // Options
    const options = []
    options.push(`method: ${JSON.stringify(feature.method)}`)
    options.push(`protocol: address.protocol()`)
    options.push(`hostname: address.hostname()`)
    options.push(`port: address.port()`)
    options.push(`path: address.path() + address.search()`)
    if (params.has('region')) {
      const region = util.evalString(params.get('region'))
      options.push(`region: ${region}`)
    }
    if (params.has('service')) {
      const service = util.evalString(params.get('service'))
      options.push(`service: ${service}`)
    }
    this.pre.push(`options = {
${util.indent(options.join(`,\n`))}
}`)

    // Credential
    const credential = []
    {
      const accessKey = util.evalString(params.get('accessKey'))
      credential.push(`accessKeyId: ${accessKey}`)
    }
    {
      const secretKey = util.evalString(params.get('secretKey'))
      credential.push(`secretAccessKey: ${secretKey}`)
    }
    if (params.has('sessionToken')) {
      const sessionToken = util.evalString(params.get('sessionToken'))
      credential.push(`sessionToken: ${sessionToken}`)
    }
    this.pre.push(`credential = {
${util.indent(credential.join(`,\n`))}
}`)

    // Sign
    this.pre.push(`signed = aws4.sign(options, credential)`)

    // Request
    const protocol = feature.address.protocol()
    /* eslint-disable-next-line no-template-curly-in-string */
    this.address = '`' + protocol + '://${signed.hostname}${signed.path}`'
    this.headerSpread = new Set().add('signed.headers')
  }
}

module.exports = Aws4Auth
