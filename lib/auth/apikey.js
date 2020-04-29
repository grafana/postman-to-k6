const aid = require('../aid')

class ApiKeyAuth {
  constructor (settings) {
    const params = settings.parameters()
    const key = aid.evalString(params.get('key'))
    const value = aid.evalString(params.get('value'))
    const addTo = aid.evalString(params.get('in'))
    if (addTo !== 'header') return
    this.logic = '' + `config.headers.${key} = ${value};`
  }
}

module.exports = ApiKeyAuth
