const aid = require('../aid')

class ApiKeyAuth {
  constructor (settings) {
    const params = settings.parameters()
    const key = params.get('key')
    const value = aid.evalString(params.get('value'))

    if (params.get('in') === 'header') {
      this.logic = '' + `config.headers.${key} = ${value};`
    } else {
      this.logic = '' + `config.options.${key} = ${value};`
    }
  }
}

module.exports = ApiKeyAuth
