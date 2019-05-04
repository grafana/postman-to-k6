const aid = require('../aid')

class NtlmAuth {
  constructor (settings) {
    const params = settings.parameters()
    const username = aid.evalString(params.get('username'))
    const password = aid.evalString(params.get('password'))
    this.imports = new Map()
      .set('URI', './libs/urijs.js')
    this.logic = '' +
`const address = new URI(config.address);
address.username(${username});
address.password(${password});
config.address = address.toString();
config.options.auth = "ntlm";`
  }
}

module.exports = NtlmAuth
