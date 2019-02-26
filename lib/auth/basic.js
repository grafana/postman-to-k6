class BasicAuth {
  constructor (settings) {
    const params = settings.parameters()
    this.options = new Map()
    this.options.set('auth', 'basic')
    this.credential = {
      username: params.get('username'),
      password: params.get('password')
    }
  }
}

module.exports = BasicAuth
