const aid = require('../../aid')
const imports = require('../../render/imports')
const Item = require('../Item/separate')
const postman = require('postman-collection')
const prettier = require('prettier')
const { Auth } = require('./sym')

function render (mapped) {
  return location(mapped)
}

function location (node, depth = 1, upstreamAuth = null) {
  const auth = node[Auth] || upstreamAuth
  const tree = {}
  entries(node, tree, depth, auth)
  return tree
}

function entries (node, tree, depth, auth) {
  for (const name of Object.keys(node)) {
    const spec = node[name]
    tree[name] = entry(spec, depth, auth)
  }
}

function entry (node, depth, auth) {
  if (postman.Item.isItem(node)) {
    return item(node, depth, auth)
  } else if (typeof node === 'object') {
    return location(node, depth + 1, auth)
  } else {
    throw new Error('Unrecognized node type in file system mapping')
  }
}

function item (node, depth, auth) {
  const auths = []
  if (auth) {
    auths.push(auth)
  }
  const result = aid.makeResult()
  result.setting.id = true
  result.setting.separate = true
  const block = aid.makeGroup({ auths })
  Item(node, result, block)
  const simplified = simplify(result, block)
  return text(simplified, depth)
}

// Simplify standard rendering result
function simplify (result, block) {
  return {
    imports: result.imports,
    effectImports: result.effectImports,
    declares: block.declares,
    logic: block.main.join(`\n\n`)
  }
}

// Render item text
function text (result, depth) {
  const raw = [
    imports(result, false, depth),
    declares(result),
    result.logic
  ].filter(item => item).join(`\n\n`)
  return prettier.format(raw, { semi: true, parser: 'babel' })
}

function declares (result) {
  if (result.declares.size) {
    return `let ${[ ...result.declares ].join(`, `)};`
  } else {
    return null
  }
}

module.exports = render
