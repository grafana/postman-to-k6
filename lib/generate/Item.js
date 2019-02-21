const Request = require('./Request')

function Item () {
  const [ item ] = arguments

  return Request(item)
}

module.exports = Item
