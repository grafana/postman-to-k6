const uuidv4 = require('uuid/v4')

function id (result) {
  if (result.setting.id) {
    return uuidv4()
  } else {
    return null
  }
}

module.exports = id
