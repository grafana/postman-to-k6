const util = require('util');

module.exports = {
  enabled: true,
  header: function (bearerToken) {
    if (bearerToken) {
      return util.format("{ \"Authorization\" : \"Bearer %s\" }", bearerToken)
    }
  }

};
