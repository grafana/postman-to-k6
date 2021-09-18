const aid = require('../../aid');
const imports = require('../../render/imports');
const Item = require('../Item/separate');
const postman = require('postman-collection');
const prettier = require('prettier');
const { Auth } = require('./sym');

function render(mapped, result) {
  return location(mapped, 1, null, result);
}

function location(node, depth = 1, upstreamAuth = null, result) {
  const auth = node[Auth] || upstreamAuth;
  const tree = {};
  entries(node, tree, depth, auth, result);
  return tree;
}

function entries(node, tree, depth, auth, result) {
  for (const name of Object.keys(node)) {
    const spec = node[name];
    tree[name] = entry(spec, depth, auth, result);
  }
}

function entry(node, depth, auth, result) {
  if (postman.Item.isItem(node)) {
    return item(node, depth, auth, result);
  } else if (typeof node === 'object') {
    return location(node, depth + 1, auth, result);
  } else {
    throw new Error('Unrecognized node type in file system mapping');
  }
}

function item(node, depth, auth, itemResult) {
  const auths = [];
  if (auth) {
    auths.push(auth);
  }
  const result = Object.assign({}, aid.makeResult());
  result.setting = itemResult.setting;
  result.setting.id = true;
  result.setting.separate = true;
  result.group = itemResult.group;

  // Transform group name to item result
  if (node.group) {
    result.group = node.group;
  }
  const block = aid.makeGroup({ auths });
  Item(node, result, block);
  const simplified = simplify(result, block);
  return text(simplified, depth);
}

// Simplify standard rendering result
function simplify(result, block) {
  return {
    imports: result.imports,
    effectImports: result.effectImports,
    declares: block.declares,
    logic: block.main.join('\n\n')
  };
}

// Render item text
function text(result, depth) {
  const raw = [
    imports(result, false, depth),
    declares(result),
    result.logic
  ].filter(item => item).join('\n\n');
  return prettier.format(raw, { semi: true, parser: 'babel' });
}

function declares(result) {
  if (result.declares.size) {
    return `let ${[...result.declares].join(', ')};`;
  } else {
    return null;
  }
}

module.exports = render;
