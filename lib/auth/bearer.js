class BearerAuth {
  constructor (settings) {
    const token = settings.bearer.get('token')
    this.headers = { Authorization: `Bearer ${token}` }
  }
}

module.exports = BearerAuth
