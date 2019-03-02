const auth = require('./auth')
const { VariableType } = require('./enum')

const tabSize = 2
const variable = /{{(.*)}}/
const variables = /{{(.*?)}}/g

// Runtime evaluated object key
// May contain runtime resolved interpolation
function evalKey (text) {
  if (variable.test(text)) {
    return `[${evalString(text)}]`
  } else {
    return JSON.stringify(text)
  }
}

// Runtime evaluated string
// May contain runtime resolved interpolation
function evalString (text) {
  if (variable.test(text)) {
    const resolved =
      text.replace(variables, (match, name) => `\${${evalVar(name)}}`)
    return `\`${resolved}\``
  } else {
    return JSON.stringify(text)
  }
}

// Runtime evaluated variable
// Interpolated into runtime evaluated string
function evalVar (name) {
  return `vars[${JSON.stringify(name)}]`
}

function indent (text) {
  const prefix = ' '.repeat(tabSize)
  return text
    .split('\n')
    .map(line => line ? prefix + line : line)
    .join('\n')
}

function makeGroup (name = null) {
  return {
    name,
    declares: new Set(),
    main: []
  }
}

function makeResult () {
  return {
    options: {},
    imports: new Map(),
    vars: new Map(),
    declares: new Set(),
    main: []
  }
}

function spread (list) {
  const array = []
  list.each(item => array.push(item))
  return array
}

function validAuth (type) {
  return Object.keys(auth).includes(type)
}

function variableType (variable) {
  switch (variable.type) {
    case 'boolean':
      return VariableType.Boolean
    case 'json':
      return VariableType.Json
    case 'number':
      return VariableType.Number
    case 'string':
      return VariableType.String
    case 'any':
    default:
      switch (typeof variable.get()) {
        case 'boolean':
          return VariableType.Boolean
        case 'number':
          return VariableType.Number
        case 'object':
        case 'undefined':
          return VariableType.Literal
        case 'string':
        default:
          return VariableType.String
      }
  }
}

Object.assign(exports, {
  evalKey,
  evalString,
  indent,
  makeGroup,
  makeResult,
  spread,
  validAuth,
  variableType
})
