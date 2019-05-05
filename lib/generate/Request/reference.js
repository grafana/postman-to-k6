function reference (name, result, block) {
  log(name, result)
  logic(name, result, block)
}

function logic (name, result, block) {
  const args = []
  args.push(JSON.stringify(name))
  if (result.request[name] > 1) {
    args.push(result.request[name].toString())
  }
  block.main.push(`postman[Request](${args.join(`, `)});`)
}

// Log name usage
// Enables correct indexing on name collision
function log (name, result) {
  if (name in result.request) {
    result.request[name]++
  } else {
    result.request[name] = 1
  }
}

module.exports = reference
