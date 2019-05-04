const auth = require('./auth')
const { VariableType } = require('./enum')

const tabSize = 2
const variable = /{{(.*)}}/
const variableStart = /^{{(.*)}}/
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
  return `pm[Var](${JSON.stringify(name)})`
}

function indent (text) {
  const prefix = ' '.repeat(tabSize)
  return text
    .split('\n')
    .map(line => line ? prefix + line : line)
    .join('\n')
}

function makeGroup ({
  name = null,
  auths = []
} = {}) {
  return {
    name,
    declares: new Set(),
    pre: null,
    post: null,
    auths: [ ...auths ],
    main: []
  }
}

function makeResult () {
  return {
    setting: {
      id: false,
      oauth1: {}
    },
    options: {},
    iterations: null,
    scope: {
      global: new Map(),
      collection: new Map(),
      environment: new Map()
    },
    data: {
      path: null,
      type: null
    },
    imports: new Map(),
    effectImports: new Set(),
    symbols: new Map(),
    declares: new Set(),
    pre: null,
    post: null,
    auths: [],
    main: []
  }
}

function spread (list) {
  const array = []
  list.each(item => array.push(item))
  return array
}

const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const digit = '0123456789abcdefghijklmnop'
function * SuffixGenerator () {
  yield null // No initial suffix
  let iteration = -1
  while (true) {
    iteration++
    yield Number(iteration)
      .toString(26)
      .replace(/./g, char => letter[digit.indexOf(char)])
  }
}

function validAuth (type) {
  return Object.keys(auth).includes(type)
}

function variableType (type, value) {
  switch (type) {
    case 'boolean':
      return VariableType.Boolean
    case 'json':
      return VariableType.Json
    case 'number':
      return VariableType.Number
    case 'string':
    case 'text':
      return VariableType.String
    case 'any':
    default:
      switch (typeof value) {
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
  SuffixGenerator,
  validAuth,
  variableStart,
  variableType
})
