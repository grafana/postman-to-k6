const fs = require('fs')
const postman = require('postman-collection')

// Read and parse collection file
function collection (path) {
  const json = fs.readFileSync(path, { encoding: 'utf8' })
  const tree = JSON.parse(json)
  return new postman.Collection(tree)
}

module.exports = collection
