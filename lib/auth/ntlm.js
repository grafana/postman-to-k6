const util = require('../util')

class NtlmAuth {
  constructor (settings) {
    const params = settings.parameters()
    const username = util.evalString(params.get('username'))
    const password = util.evalString(params.get('password'))
    this.imports = new Map()
      .set('URI', './bundle/urijs.js')
    this.logic = '' +
`const address = new URI(config.address);
address.username(${username});
address.password(${password});
config.address = address.toString();
config.options.auth = "ntlm";`
  }
}

module.exports = NtlmAuth
