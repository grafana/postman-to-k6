class BearerAuth {
  constructor (settings) {
    this.headers = new Map()
    const token = settings.bearer.get('token')
    this.headers.set('Authorization', `Bearer ${token}`)
  }
}

module.exports = BearerAuth
