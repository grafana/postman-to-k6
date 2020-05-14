const aid = require('../aid');

class BearerAuth {
  constructor(settings) {
    const params = settings.parameters();
    const token = params.get('token');
    const value = aid.evalString(`Bearer ${token}`);
    this.logic = '' + `config.headers.Authorization = ${value};`;
  }
}

module.exports = BearerAuth;
