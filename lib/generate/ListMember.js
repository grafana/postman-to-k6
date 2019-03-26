module.exports = (...args) => { return ListMember(...args) }

const Item = require('./Item')
const ItemGroup = require('./ItemGroup')
const postman = require('postman-collection')

/* Item|ItemGroup */
function ListMember (member, result, block = result) {
  if (postman.ItemGroup.isItemGroup(member)) {
    ItemGroup(member, result, block)
  } else if (postman.Item.isItem(member)) {
    Item(member, result, block)
  } else {
    throw new Error('Unrecognized list member type')
  }
}
