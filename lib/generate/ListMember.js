const Item = require('./Item')
const ItemGroup = require('./ItemGroup')
const postman = require('postman-collection')

/* Item|ItemGroup */
function ListMember (item, result, allVariables) {
  if (postman.ItemGroup.isItemGroup(item)) {
    ItemGroup(item, result, allVariables)
  } else if (postman.Item.isItem(item)) {
    var k6Request = Item(item)

    if (k6Request.variables) {
      k6Request.variables.forEach(function (item) {
        allVariables.push(item)
      })
    }
    result.push(k6Request.result)
  } else {
    throw new Error(' TODO: Implement postCollection item')
  }
}

module.exports = ListMember
