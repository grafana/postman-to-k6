const aid = require('../../aid')

function renderConfig (name, id, feature) {
  const items = []
  items.push(`name: ${JSON.stringify(name)}`)
  if (id) items.push(`id: ${JSON.stringify(id)}`)
  items.push(`method: ${JSON.stringify(feature.method)}`)
  items.push(`address: ${renderAddress(feature.address)}`)
  const data = renderData(feature.data, feature.dataSpread)
  if (data) {
    items.push(`data: ${data}`)
  }
  const headers = renderHeaders(feature.headers, feature.headerSpread)
  if (headers) {
    items.push(`headers: ${headers}`)
  }
  const options = renderOptions(feature.options)
  if (options) {
    items.push(`options: ${options}`)
  }
  renderLogic(items, feature)
  return `{
${aid.indent(items.join(`,\n`))}
}`
}

function renderAddress (address) {
  if (typeof address === 'string') {
    return address
  } else {
    return JSON.stringify(address.toString())
  }
}

function renderData (data, spread) {
  if (!(data || spread.size)) {
    return null
  }
  const directData = data ? JSON.stringify(data) : null
  return renderDataSpread(directData, [ ...spread ])
}

function renderDataSpread (target, spread) {
  if (!spread.length) {
    return target
  }
  const source = spread.pop()
  if (!target) {
    return renderDataSpread(source, spread)
  }
  return `Object.assign(${renderDataSpread(target, spread)}, ${source})`
}

function renderOptions (options) {
  if (!options.size) {
    return null
  }
  const items = []
  for (const [ key, value ] of options) {
    items.push(`${key}: ${JSON.stringify(value)}`)
  }
  return `{
${aid.indent(items.join(`,\n`))}
}`
}

function renderHeaders (headers, spread) {
  if (!(headers.size || spread.size)) {
    return null
  }
  const directHeaders = renderDirectHeaders(headers)
  const rendered = renderHeaderSpread(directHeaders, [ ...spread ])
  return rendered
}

function renderDirectHeaders (headers) {
  if (!headers.size) {
    return null
  }
  const items = []
  for (const item of headers) {
    const key = aid.evalKey(item[0])
    const value = renderHeaderValue(item[1])
    items.push(`${key}: ${value}`)
  }
  return `{
${aid.indent(items.join(`,\n`))}
}`
}

function renderHeaderValue (spec) {
  if (typeof spec === 'object') {
    if (spec.raw) {
      return spec.value
    } else {
      return JSON.stringify(spec.value)
    }
  } else {
    return JSON.stringify(spec)
  }
}

function renderHeaderSpread (target, spread) {
  if (!spread.length) {
    return target
  }
  const source = spread.pop()
  if (!target) {
    return renderHeaderSpread(source, spread)
  }
  return `Object.assign(${renderHeaderSpread(target, spread)}, ${source})`
}

function renderLogic (items, feature) {
  const pre = renderPre(feature.pre)
  if (pre) {
    items.push(pre)
  }
  const post = renderPost(feature.post)
  if (post) {
    items.push(post)
  }
  const auth = renderAuth(feature.auth)
  if (auth) {
    items.push(auth)
  }
}

function renderPre (pre) {
  if (pre.length) {
    return `pre() {
${aid.indent(pre.join(`\n`))}
}`
  } else {
    return null
  }
}

function renderPost (post) {
  if (post.length) {
    return `post(response) {
${aid.indent(post.join(`\n`))}
}`
  } else {
    return null
  }
}

function renderAuth (auth) {
  if (auth) {
    return `auth(config, Var) {
${aid.indent(auth)}
}`
  } else {
    return null
  }
}

module.exports = renderConfig
