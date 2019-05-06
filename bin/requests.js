const fs = require('fs-extra')
const path = require('path')

function outputRequests (dir, requests) {
  const address = [ dir, 'requests' ]
  location(requests, address)

  for (const file of Object.keys(requests)) {
    const logic = requests[file]
    try {
      fs.writeFileSync(`${dir}/requests/${file}`, logic)
    } catch (e) {
      console.error(`Could not create request file ${file}`)
      console.error(e)
      return false
    }
  }
  return true
}

function location (node, address) {
  const target = path.join(...address)
  fs.ensureDirSync(target)
  for (const name of Object.keys(node)) {
    const downstreamAddress = [ ...address ]
    downstreamAddress.push(name)
    entry(node[name], downstreamAddress)
  }
}

function entry (node, address) {
  switch (typeof node) {
    case 'string':
      item(node, address)
      break
    case 'object':
      location(node, address)
      break
    default:
      throw new Error('Invalid request mapping node')
  }
}

function item (text, address) {
  const target = path.join(...address)
  fs.writeFileSync(target, text)
}

module.exports = outputRequests
