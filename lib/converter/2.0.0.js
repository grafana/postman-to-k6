var Collection = require('postman-collection').Collection
var K6Generator = require('../generator')

function convert (content) {
  var collection = new Collection(content)
  var generator = new K6Generator()
  return generator.convert(collection)
}

exports.convert = convert
