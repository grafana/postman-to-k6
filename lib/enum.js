const postman = require('postman-collection')

const BodyMode = postman.RequestBody.MODES

const VariableType = Object.freeze({
  Boolean: 0,
  Json: 1,
  Number: 2,
  String: 3,
  Literal: 4
})

Object.assign(exports, {
  BodyMode,
  VariableType
})
