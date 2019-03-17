const util = require('../util')

class BearerAuth {
  constructor (settings) {
    const params = settings.parameters()
    const token = params.get('token')
    const value = util.evalString(`Bearer ${token}`)
    this.logic = '' +
`config.headers.Authorization = ${value};`
  }
}

module.exports = BearerAuth
