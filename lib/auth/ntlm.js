class NtlmAuth {
  constructor (settings) {
    const params = settings.parameters()
    this.options = new Map()
    this.options.set('auth', 'ntlm')
    this.credential = {
      username: params.get('username'),
      password: params.get('password')
    }
  }
}

module.exports = NtlmAuth
