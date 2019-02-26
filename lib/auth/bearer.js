class BearerAuth {
  constructor (settings) {
    const params = settings.parameters()
    this.headers = new Map()
    const token = params.get('token')
    this.headers.set('Authorization', `Bearer ${token}`)
  }
}

module.exports = BearerAuth
