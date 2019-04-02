const aid = require('../aid')

const staticImports = [ './libs/shim/core.js' ]

function imports (result, native, compat, statics = true, depth = 0) {
  const lines = []
  for (const item of [ ...staticImports, ...result.effectImports ]) {
    lines.push(`import ${JSON.stringify(item)};`)
  }
  nativeImports(native, lines)
  compatImports(compat, lines, depth)
  return lines.join(`\n`)
}

function nativeImports (native, lines) {
  const { direct, indirect } = aggregateImports(native)
  for (const [ name, id ] of direct) {
    lines.push(`imports ${name} from ${JSON.stringify(id)};`)
  }
  for (const id of Object.keys(indirect)) {
    const destructure = `{ ${indirect[id].join(`, `)} }`
    lines.push(`import ${destructure} from ${JSON.stringify(id)};`)
  }
}

function aggregateImports (imports) {
  const direct = []
  const indirect = {}
  for (const [ name, spec ] of imports) {
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
  return { direct, indirect }
}

function compatImports (compat, lines, depth) {
  if (!compat.size) {
    return
  }
  const path = resolve(depth)
  const entries = [ ...compat ]
    .map(([ name ]) => name)
    .sort(aid.sortCaseInsensitive)
  lines.push(`import {
${aid.indent(entries.join(`,\n`))}
} from ${JSON.stringify(path)};`)
}

function resolve (depth) {
  if (depth) {
    return prefix(depth) + 'libs/compat.js'
  } else {
    return './libs/compat.js'
  }
}

function prefix (depth) {
  return '../'.repeat(depth)
}

module.exports = imports
