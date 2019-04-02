function classifyImports (result) {
  const native = new Map()
  const compat = new Map()
  for (const [ name, spec ] of result.imports) {
    const base = (typeof spec === 'object' ? spec.base : spec)
    if (/^k6/.test(base)) {
      native.set(name, spec)
    } else {
      compat.set(name, spec)
    }
  }
  return [ native, compat ]
}

module.exports = classifyImports
