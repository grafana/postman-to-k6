class BearerAuth {
  constructor (settings) {
    this.headers = new Map()
    const token = settings.parameters().get('token')
    this.headers.set('Authorization', `Bearer ${token}`)
  }
}

module.exports = BearerAuth
