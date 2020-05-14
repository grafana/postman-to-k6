const aid = require('../aid');

const Location = Object.freeze({
  Address: 0,
  Body: 1,
  Header: 2,
});

class Oauth2Auth {
  constructor(settings, feature) {
    const params = settings.parameters();
    const location = getLocation(params);
    const token = params.get('accessToken');
    switch (location) {
      case Location.Header: {
        const value = aid.evalString(`Bearer ${token}`);
        this.logic = `config.headers.Authorization = ${value}`;
        break;
      }
      case Location.Address: {
        this.imports = new Map().set('URI', './libs/urijs.js');
        const evalToken = aid.evalString(token);
        this.logic = `const address = new URI(config.address);
address.addQuery("access_token", ${evalToken});
config.address = address.toString();`;
        break;
      }
    }
  }
}

function getLocation(params) {
  const label = params.get('addTokenTo');
  switch (label) {
    case 'header':
      return Location.Header;
    case 'queryParams':
      return Location.Address;
    default:
      throw new Error(`Unrecognized auth data location: ${label}`);
  }
}

module.exports = Oauth2Auth;
