const Request = require('./Request')

function Item (item, result, block) {
  return Request(item, result, block)
}

module.exports = Item
