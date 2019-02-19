var Collection = require('postman-collection').Collection
var Generator = require('../generator')

function convert (content) {
  var collection = new Collection(content)
  var generator = new Generator()
  return generator.convert(collection)
}

exports.convert = convert
