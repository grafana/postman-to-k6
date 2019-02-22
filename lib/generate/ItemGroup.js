const ListMember = require('./ListMember')

function ItemGroup (node, result, allVariables) {
  if (node.auth) { throw new Error(' TODO: folder.auth') }

  result.push('')
  result.push(`  group("${node.name}", function() {\n`)
  result.push('    let res;')
  node.items.each(function (folderItem, index) {
    ListMember(folderItem, result, allVariables)
  })
  result.push('  });\n')
}

module.exports = ItemGroup
