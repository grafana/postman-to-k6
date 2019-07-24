function requestImports (requests) {
  if (requests) {
    const lines = []
    const path = [ '.', 'requests' ]
    location(requests, path, lines)
    return lines.join(`\n`)
  } else {
    return null
  }
}

function location (node, path, lines) {
  entries(node, path, lines)
}

function entries (node, path, lines) {
  for (const name of Object.keys(node)) {
    const downstreamPath = [ ...path ]
    downstreamPath.push(name)
    entry(node[name], downstreamPath, lines)
  }
}

function entry (node, path, lines) {
  switch (typeof node) {
    case 'string':
      item(path, lines)
      break
    case 'object':
      location(node, path, lines)
      break
    default:
      throw new Error('Invalid request mapping node')
  }
}

function item (path, lines) {
  const id = path.join('/')
  lines.push(`import ${JSON.stringify(id)};`)
}

module.exports = requestImports
