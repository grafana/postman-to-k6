const tabSize = 2

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
    main: [],
    declares: new Set()
  }
}

function makeResult () {
  return {
    main: [],
    vars: new Map(),
    imports: new Map(),
    options: {},
    declares: new Set()
  }
}

function spread (list) {
  const array = []
  list.each(item => array.push(item))
  return array
}

Object.assign(exports, {
  indent,
  makeGroup,
  makeResult,
  spread
})
