
var Collection = require('postman-collection').Collection,
    K6jsGenerator = require('../postman/k6-generator');

module.exports = {

  convert: function(content, callback) {

    try {
      var collection = new Collection(content);
      var result = K6jsGenerator.convert(collection)
      callback(null, result);
    } catch(error) {
      callback(error);
    }

  }

}
