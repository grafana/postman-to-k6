const staticImports = [ './libs/shim/core.js' ]

function imports (result, statics = true) {
  const direct = []
  const indirect = {}
  for (const [ name, spec ] of result.imports) {
    if (typeof spec === 'object') {
      const { base } = spec
      if (!(base in indirect)) {
        indirect[base] = []
      }
      indirect[base].push(name)
    } else {
      direct.push([ name, spec ])
    }
  }
  const lines = []
  if (statics) {
    for (const path of staticImports) {
      lines.push(staticImport(path))
    }
  }
  for (const item of result.effectImports) {
    lines.push(`import ${JSON.stringify(item)};`)
  }
  for (const [ name, path ] of direct) {
    lines.push(imp(name, path))
  }
  for (const key of Object.keys(indirect)) {
    const name = `{ ${indirect[key].join(`, `)} }`
    lines.push(imp(name, key))
  }
  return lines.join(`\n`)
}

function staticImport (path) {
  return `import ${JSON.stringify(path)};`
}

function imp (name, path) {
  return `import ${name} from ${JSON.stringify(path)};`
}

module.exports = imports
