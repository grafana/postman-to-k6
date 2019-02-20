const Collection = require('postman-collection').Collection
const Generator = require('../generator')

function convert (content) {
  var collection = new Collection(content)
  var generator = new Generator()
  return generator.convert(collection)
}

exports.convert = convert
