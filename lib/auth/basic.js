class BasicAuth {
  constructor (settings) {
    const params = settings.basic
    if (!params) return
    this.headers = new Map()
    const credentialString = `${params.username}:${params.password}`
    const credentialBinary = Buffer.from(credentialString, 'utf8')
    const credential = credentialBinary.toString('base64')
    this.headers.set('Authorization', `Basic ${credential}`)
  }
}

module.exports = BasicAuth
