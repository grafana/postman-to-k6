/* global postman pm globals environment data */

import test from 'ava'
import mockRequire from 'mock-require'
let k6, http

const undef = void 0
const Reset = Symbol.for('reset')
const Initial = Symbol.for('initial')
const Iteration = Symbol.for('iteration')
const Request = Symbol.for('request')
const Var = Symbol.for('variable')

test.before(t => {
  mockRequire('k6', 'stub/k6')
  mockRequire('k6/http', 'stub/http')
  k6 = require('k6')
  http = require('k6/http')
  require('shim/core')
})

test.beforeEach(t => {
  k6[Reset]()
  http[Reset]()
  postman[Reset]()
})

test.serial('$guid', t => {
  postman[Initial]()
  const value = pm[Var]('$guid')
  t.true(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(value))
})

test.serial('$randomInt', t => {
  postman[Initial]()
  const value = pm[Var]('$randomInt')
  t.true(value >= 0 && value <= 1000)
})

test.serial('$timestamp', t => {
  postman[Initial]()
  const value = pm[Var]('$timestamp')
  t.is(typeof value, 'number')
})

test.serial('globals read clear', t => {
  postman[Initial]()
  t.is(globals.test, undef)
})

test.serial('globals read set', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(globals.test, 'a')
})

test.serial('globals write', t => {
  postman[Initial]()
  t.throws(() => {
    globals.test = 'a'
  })
})

test.serial('environment read clear', t => {
  postman[Initial]()
  t.is(environment.test, undef)
})

test.serial('environment read set', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
})

test.serial('environment write', t => {
  postman[Initial]()
  t.throws(() => {
    environment.test = 'a'
  })
})

test.serial('data read clear', t => {
  postman[Initial]({ data: [] })
  postman[Iteration]()
  t.is(data.test, undef)
})

test.serial('data read set', t => {
  postman[Initial]({ data: [ { test: 'a' } ] })
  postman[Iteration]()
  t.is(data.test, 'a')
})

test.serial('data read iterated', t => {
  postman[Initial]({
    data: [
      { test: 'a' },
      { test: 'b' },
      { test: 'c' }
    ]
  })
  postman[Iteration]()
  t.is(data.test, 'a')
  postman[Iteration]()
  t.is(data.test, 'b')
  postman[Iteration]()
  t.is(data.test, 'c')
})

test.serial('data write', t => {
  postman[Initial]({ data: [] })
  postman[Iteration]()
  t.throws(() => {
    data.test = 'a'
  })
})

test.serial('postman.getGlobalVariable clear', t => {
  postman[Initial]()
  t.is(postman.getGlobalVariable('test'), undef)
})

test.serial('postman.getGlobalVariable set', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(postman.getGlobalVariable('test'), 'a')
})

test.serial('postman.setGlobalVariable clear', t => {
  postman[Initial]()
  t.is(globals.test, undef)
  postman.setGlobalVariable('test', 'a')
  t.is(globals.test, 'a')
})

test.serial('postman.setGlobalVariable set', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(globals.test, 'a')
  postman.setGlobalVariable('test', 'b')
  t.is(globals.test, 'b')
})

test.serial('postman.clearGlobalVariable', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(globals.test, 'a')
  postman.clearGlobalVariable('test')
  t.is(globals.test, undef)
})

test.serial('postman.clearGlobalVariables', t => {
  postman[Initial]({ global: { test: 'a', test2: 'b' } })
  t.is(globals.test, 'a')
  t.is(globals.test2, 'b')
  postman.clearGlobalVariables()
  t.is(globals.test, undef)
  t.is(globals.test2, undef)
})

test.serial('postman.getEnvironmentVariable clear', t => {
  postman[Initial]({ environment: {} })
  t.is(postman.getEnvironmentVariable('test'), undef)
})

test.serial('postman.getEnvironmentVariable set', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(postman.getEnvironmentVariable('test'), 'a')
})

test.serial('postman.setEnvironmentVariable clear', t => {
  postman[Initial]({ environment: {} })
  t.is(environment.test, undef)
  postman.setEnvironmentVariable('test', 'a')
  t.is(environment.test, 'a')
})

test.serial('postman.setEnvironmentVariable set', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
  postman.setEnvironmentVariable('test', 'b')
  t.is(environment.test, 'b')
})

test.serial('postman.clearEnvironmentVariable', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
  postman.clearEnvironmentVariable('test')
  t.is(environment.test, undef)
})

test.serial('postman.clearEnvironmentVariables', t => {
  postman[Initial]({ environment: { test: 'a', test2: 'b' } })
  t.is(environment.test, 'a')
  t.is(environment.test2, 'b')
  postman.clearEnvironmentVariables()
  t.is(environment.test, undef)
  t.is(environment.test2, undef)
})

test.serial('pm.environment.clear', t => {
  postman[Initial]({ environment: { test: 'a', test2: 'b' } })
  t.is(environment.test, 'a')
  t.is(environment.test2, 'b')
  pm.environment.clear()
  t.is(environment.test, undef)
  t.is(environment.test2, undef)
})

test.serial('pm.environment.get clear', t => {
  postman[Initial]({ environment: {} })
  t.is(pm.environment.get('test'), undef)
})

test.serial('pm.environment.get set', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(pm.environment.get('test'), 'a')
})

test.serial('pm.environment.has clear', t => {
  postman[Initial]({ environment: {} })
  t.is(pm.environment.has('test'), false)
})

test.serial('pm.environment.has set', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(pm.environment.has('test'), true)
})

test.serial('pm.environment.set clear', t => {
  postman[Initial]({ environment: {} })
  t.is(environment.test, undef)
  pm.environment.set('test', 'a')
  t.is(environment.test, 'a')
})

test.serial('pm.environment.set set', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
  pm.environment.set('test', 'b')
  t.is(environment.test, 'b')
})

test.serial('pm.environment.toObject', t => {
  postman[Initial]({ environment: { test: 'a', test2: 'b' } })
  const values = pm.environment.toObject()
  t.is(typeof values, 'object')
  t.is(values.test, 'a')
  t.is(values.test2, 'b')
})

test.serial('pm.environment.unset', t => {
  postman[Initial]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
  pm.environment.unset('test')
  t.is(environment.test, undef)
})

test.serial('pm.globals.clear', t => {
  postman[Initial]({ global: { test: 'a', test2: 'b', test3: 'c' } })
  t.is(globals.test, 'a')
  t.is(globals.test2, 'b')
  t.is(globals.test3, 'c')
  pm.globals.clear()
  t.is(globals.test, undef)
  t.is(globals.test2, undef)
  t.is(globals.test3, undef)
})

test.serial('pm.globals.get clear', t => {
  postman[Initial]()
  t.is(pm.globals.get('test'), undef)
})

test.serial('pm.globals.get set', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(pm.globals.get('test'), 'a')
})

test.serial('pm.globals.has clear', t => {
  postman[Initial]()
  t.is(pm.globals.has('test'), false)
})

test.serial('pm.globals.has set', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(pm.globals.has('test'), true)
})

test.serial('pm.globals.set clear', t => {
  postman[Initial]()
  t.is(globals.test, undef)
  pm.globals.set('test', 'a')
  t.is(globals.test, 'a')
})

test.serial('pm.globals.toObject', t => {
  postman[Initial]({ global: { test: 'a', test2: 'b' } })
  const values = pm.globals.toObject()
  t.is(typeof values, 'object')
  t.is(values.test, 'a')
  t.is(values.test2, 'b')
})

test.serial('pm.globals.unset', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(globals.test, 'a')
  pm.globals.unset('test')
  t.is(globals.test, undef)
})

test.serial('pm.iterationData unavailable', t => {
  postman[Initial]()
  t.is(pm.iterationData, undef)
})

test.serial('pm.iterationData.get clear', t => {
  postman[Initial]({ data: [ {} ] })
  postman[Iteration]()
  t.is(pm.iterationData.get('test'), undef)
})

test.serial('pm.iterationData.get set', t => {
  postman[Initial]({ data: [ { test: 'a' } ] })
  postman[Iteration]()
  t.is(pm.iterationData.get('test'), 'a')
})

test.serial('pm.iterationData.get iterated', t => {
  postman[Initial]({
    data: [
      { test: 'a' },
      { test: 'b' },
      { test: 'c' }
    ]
  })
  postman[Iteration]()
  t.is(pm.iterationData.get('test'), 'a')
  postman[Iteration]()
  t.is(pm.iterationData.get('test'), 'b')
  postman[Iteration]()
  t.is(pm.iterationData.get('test'), 'c')
})

test.serial('pm.iterationData.toObject', t => {
  postman[Initial]({ data: [ { test: 'a', test2: 'b' } ] })
  postman[Iteration]()
  const values = pm.iterationData.toObject()
  t.is(typeof values, 'object')
  t.is(values.test, 'a')
  t.is(values.test2, 'b')
})

test.serial('pm.variables.get clear', t => {
  postman[Initial]()
  t.is(pm.variables.get('test'), undef)
})

test.serial('pm.variables.get global', t => {
  postman[Initial]({
    global: { test: 'a' }
  })
  t.is(pm.variables.get('test'), 'a')
})

test.serial('pm.variables.get collection', t => {
  postman[Initial]({
    global: { test: 'a' },
    collection: { test: 'b' }
  })
  t.is(pm.variables.get('test'), 'b')
})

test.serial('pm.variables.get environment', t => {
  postman[Initial]({
    global: { test: 'a' },
    collection: { test: 'b' },
    environment: { test: 'c' }
  })
  t.is(pm.variables.get('test'), 'c')
})

test.serial('pm.variables.get data', t => {
  postman[Initial]({
    global: { test: 'a' },
    collection: { test: 'b' },
    environment: { test: 'c' },
    data: [ { test: 'd' } ]
  })
  postman[Iteration]()
  t.is(pm.variables.get('test'), 'd')
})

test.serial('pm.variables.get data iterated', t => {
  postman[Initial]({
    data: [
      { test: 'a' },
      { test: 'b' },
      { test: 'c' }
    ]
  })
  postman[Iteration]()
  postman[Iteration]()
  t.is(pm.variables.get('test'), 'b')
})

test.serial('pm.variables.get local', t => {
  postman[Initial]({
    global: { test: 'a' },
    collection: { test: 'b' },
    environment: { test: 'c' },
    data: [ { test: 'd' } ]
  })
  postman[Iteration]()
  postman[Request]({
    pre () {
      pm.variables.set('test', 'e')
      t.is(pm.variables.get('test'), 'e')
    }
  })
})

test.serial('pm.variables.set scoped', t => {
  postman[Initial]()
  t.throws(() => {
    pm.variables.set('test', 'a')
  })
})

test.serial('pm.variables.set clear', t => {
  postman[Initial]()
  postman[Request]({
    pre () {
      t.is(pm.variables.get('test'), undef)
      pm.variables.set('test', 'a')
      t.is(pm.variables.get('test'), 'a')
    }
  })
})

test.serial('pm.variables.set set', t => {
  postman[Initial]()
  postman[Request]({
    pre () {
      pm.variables.set('test', 'a')
      t.is(pm.variables.get('test'), 'a')
      pm.variables.set('test', 'b')
      t.is(pm.variables.get('test'), 'b')
    }
  })
})

test.serial('pm[Var] simple', t => {
  postman[Initial]({ global: { test: 'a' } })
  t.is(pm[Var]('test'), 'a')
})
