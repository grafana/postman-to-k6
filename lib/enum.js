const postman = require('postman-collection')

const BodyMode = postman.RequestBody.MODES
const Method = new Set([
  'batch',
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put'
])

Object.assign(exports, {
  BodyMode,
  Method
})
