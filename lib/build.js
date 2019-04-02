const aid = require('./aid')
const browserify = require('browserify')
const fs = require('fs-extra')
const tmp = require('tmp')

async function buildCompat (imports) {
  const index = renderIndex(imports)
  const [ dir, cleanupDir ] = await makeDir()
  try {
    await stageModules(dir)
    await stageIndex(dir, index)
    return bundle(dir)
  } finally {
    cleanupDir()
  }
}

function renderIndex (imports) {
  if (!imports.size) {
    return null
  }
  const entries = []
  for (const [ name, spec ] of imports) {
    if (typeof spec === 'object') {
      entries.push(indirectEntry(name, spec))
    } else {
      entries.push(directEntry(name, spec))
    }
  }
  return `Object.assign(exports, {
${aid.indent(entries.join(`,\n`))}
})`
}

function directEntry (name, id) {
  return `${name}: require(${JSON.stringify(id)})`
}

function indirectEntry (name, spec) {
  return `${name}: require(${JSON.stringify(spec.base)}).${name}`
}

async function makeDir () {
  return new Promise((resolve, reject) => {
    tmp.dir((error, path, cleanup) => {
      if (error) {
        reject(error)
      } else {
        resolve([ path, cleanup ])
      }
    })
  })
}

async function stageModules (dir) {
  return new Promise((resolve, reject) => {
    const target = `${__dirname}/../node_modules`
    fs.symlink(target, `${dir}/node_modules`, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

async function stageIndex (dir, index) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${dir}/index.js`, index, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

async function bundle (dir) {
  return new Promise((resolve, reject) => {
    const bundler = browserify(`${dir}/index.js`, { standalone: 'Compat' })
    bundler.bundle((error, buffer) => {
      if (error) {
        reject(error)
      } else {
        const string = buffer.toString('utf8')
        resolve(string)
      }
    })
  })
}

module.exports = buildCompat
