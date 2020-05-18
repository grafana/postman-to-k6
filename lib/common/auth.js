const { InheritAuth } = require('../sym');

function readAuth(settings, auths, inherit = true) {
  if (inherit) {
    auths.push(settings || InheritAuth);
  } else if (settings) {
    auths.push(settings);
  }
}

module.exports = readAuth;
