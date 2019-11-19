const postman = require('postman-collection')

const BodyItemType = Object.freeze({
  Text: 0,
  File: 1
})

const BodyMode = postman.RequestBody.MODES

const VariableType = Object.freeze({
  Boolean: 0,
  Json: 1,
  Number: 2,
  String: 3,
  Literal: 4
})

Object.assign(exports, {
  BodyItemType,
  BodyMode,
  VariableType
})
