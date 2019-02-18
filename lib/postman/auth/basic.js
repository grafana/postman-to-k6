var util = require('util')

module.exports = {
  enabled: true,
  header: function (request) {
    var params = request.auth['basic']
    if (params) {
      return util.format('{ "Authorization" : "Basic %s" }', Buffer.from(params.username + ':' + params.password).toString('base64'))
    }
  }

}
