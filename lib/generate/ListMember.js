const Item = require('./Item')
const postman = require('postman-collection')

/* Item|ItemGroup */
function ListMember (item, result, allVariables) {
  if (postman.ItemGroup.isItemGroup(item)) {
    var folder = item
    if (folder.auth) { throw new Error(' TODO: folder.auth') }

    result.push('')
    result.push(`  group("${folder.name}", function() {\n`)
    result.push('    let res;')
    folder.items.each(function (folderItem, index) {
      ListMember(folderItem, result, allVariables)
    })
    result.push('  });\n')
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
