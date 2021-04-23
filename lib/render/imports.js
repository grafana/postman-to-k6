const staticImports = ['./libs/shim/core.js'];

function imports(result, statics = true, depth = 0) {
  const direct = [];
  const indirect = {};
  for (const [name, spec] of result.imports) {
    if (typeof spec === 'object') {
      const { base } = spec;
      if (!(base in indirect)) {
        indirect[base] = [];
      }
      indirect[base].push(name);
    } else {
      direct.push([name, spec]);
    }
  }
  const lines = [];
  if (statics) {
    for (const path of staticImports) {
      lines.push(staticImport(path));
    }
  }
  if (
    !(
      result.setting &&
      result.setting.separate &&
      result.setting.separate === true
    )
  ) {
    for (const item of result.effectImports) {
      lines.push(`import ${JSON.stringify(item)};`);
    }
  }
  for (const [name, path] of direct) {
    lines.push(imp(name, path, depth));
  }
  for (const key of Object.keys(indirect)) {
    const name = `{ ${indirect[key].join(', ')} }`;
    lines.push(imp(name, key, depth));
  }
  return lines.join('\n');
}

function staticImport(path) {
  return `import ${JSON.stringify(path)};`;
}

function imp(name, path, depth) {
  const id = resolve(path, depth);
  return `import ${name} from ${JSON.stringify(id)};`;
}

function resolve(path, depth) {
  if (depth && path.startsWith('./')) {
    return prefix(depth) + path.substring(2);
  } else {
    return path;
  }
}

function prefix(depth) {
  return '../'.repeat(depth);
}

module.exports = imports;
