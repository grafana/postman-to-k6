class DigestAuth {
  constructor (settings) {
    const params = settings.digest
    this.options = new Map()
    this.options.set('auth', 'digest')
    this.credential = {
      username: params.username,
      password: params.password
    }
  }
}

module.exports = DigestAuth
