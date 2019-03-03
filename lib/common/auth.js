const { InheritAuth } = require('../sym')

function readAuth (settings, auths) {
  auths.push(settings || InheritAuth)
}

module.exports = readAuth
