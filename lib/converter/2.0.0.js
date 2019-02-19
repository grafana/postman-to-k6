var Collection = require('postman-collection').Collection
var K6Generator = require('../postman/k6-generator')

module.exports = {

  convert: function (content, callback) {
    try {
      var collection = new Collection(content)
      var generator = new K6Generator()
      var result = generator.convert(collection)
      callback(null, result)
    } catch (error) {
      callback(error)
    }
  }

}
