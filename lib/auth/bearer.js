const util = require('../util')

class BearerAuth {
  constructor (settings) {
    const params = settings.parameters()
    this.headers = new Map()
    const token = params.get('token')
    const value = util.evalString(`Bearer ${token}`)
    this.headers.set('Authorization', { raw: true, value })
  }
}

module.exports = BearerAuth
