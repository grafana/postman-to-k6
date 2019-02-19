var Collection = require('postman-collection').Collection
var K6Generator = require('../postman/k6-generator')

module.exports = {

  convert: function (content) {
    var collection = new Collection(content)
    var generator = new K6Generator()
    return generator.convert(collection)
  }

}
