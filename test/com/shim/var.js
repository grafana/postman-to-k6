/* global postman pm globals environment data */

import test from 'ava'
import 'shim'

const undef = void 0
const Reset = Symbol.for('reset')
const Scope = Symbol.for('scope')
const Iteration = Symbol.for('iteration')
const Var = Symbol.for('variable')

test.beforeEach(t => {
  postman[Reset]()
})

test.serial('globals read clear', t => {
  postman[Scope]()
  t.is(globals.test, undef)
})

test.serial('globals read set', t => {
  postman[Scope]({ global: { test: 'a' } })
  t.is(globals.test, 'a')
})

test.serial('globals write', t => {
  postman[Scope]()
  t.throws(() => {
    globals.test = 'a'
  })
})

test.serial('postman.getGlobalVariable clear', t => {
  postman[Scope]()
  t.is(postman.getGlobalVariable('test'), undef)
})

test.serial('postman.getGlobalVariable set', t => {
  postman[Scope]({ global: { test: 'a' } })
  t.is(postman.getGlobalVariable('test'), 'a')
})

test.serial('postman.setGlobalVariable clear', t => {
  postman[Scope]()
  postman.setGlobalVariable('test', 'a')
  t.is(globals.test, 'a')
})

test.serial('postman.setGlobalVariable set', t => {
  postman[Scope]({ global: { test: 'a' } })
  postman.setGlobalVariable('test', 'b')
  t.is(globals.test, 'b')
})

test.serial('postman.clearGlobalVariable', t => {
  postman[Scope]({ global: { test: 'a' } })
  t.is(globals.test, 'a')
  postman.clearGlobalVariable('test')
  t.is(globals.test, undef)
})

test.serial('postman.clearGlobalVariables', t => {
  postman[Scope]({ global: { test: 'a', test2: 'b' } })
  t.is(globals.test, 'a')
  t.is(globals.test2, 'b')
  postman.clearGlobalVariables()
  t.is(globals.test, undef)
  t.is(globals.test2, undef)
})

test.serial('environment read clear', t => {
  postman[Scope]()
  t.is(environment.test, undef)
})

test.serial('environment read set', t => {
  postman[Scope]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
})

test.serial('environment write', t => {
  postman[Scope]()
  t.throws(() => {
    environment.test = 'a'
  })
})

test.serial('postman.getEnvironmentVariable clear', t => {
  postman[Scope]({ environment: {} })
  t.is(postman.getEnvironmentVariable('test'), undef)
})

test.serial('postman.getEnvironmentVariable set', t => {
  postman[Scope]({ environment: { test: 'a' } })
  t.is(postman.getEnvironmentVariable('test'), 'a')
})

test.serial('postman.setEnvironmentVariable clear', t => {
  postman[Scope]({ environment: {} })
  postman.setEnvironmentVariable('test', 'a')
  t.is(environment.test, 'a')
})

test.serial('postman.setEnvironmentVariable set', t => {
  postman[Scope]({ environment: { test: 'a' } })
  postman.setEnvironmentVariable('test', 'b')
  t.is(environment.test, 'b')
})

test.serial('postman.clearEnvironmentVariable', t => {
  postman[Scope]({ environment: { test: 'a' } })
  t.is(environment.test, 'a')
  postman.clearEnvironmentVariable('test')
  t.is(environment.test, undef)
})

test.serial('postman.clearEnvironmentVariables', t => {
  postman[Scope]({ environment: { test: 'a', test2: 'b' } })
  t.is(environment.test, 'a')
  t.is(environment.test2, 'b')
  postman.clearEnvironmentVariables()
  t.is(environment.test, undef)
  t.is(environment.test2, undef)
})

test.serial('pm.variables.get clear', t => {
  postman[Scope]()
  t.is(pm.variables.get('test'), undef)
})

test.serial('pm.variables.get global', t => {
  postman[Scope]({ global: { test: 'a' } })
  t.is(pm.variables.get('test'), 'a')
})

test.serial('pm.variables.get collection', t => {
  postman[Scope]({
    global: { test: 'a' },
    collection: { test: 'b' }
  })
  t.is(pm.variables.get('test'), 'b')
})

test.serial('pm.variables.get environment', t => {
  postman[Scope]({
    global: { test: 'a' },
    collection: { test: 'b' },
    environment: { test: 'c' }
  })
  t.is(pm.variables.get('test'), 'c')
})

test.serial('data read clear', t => {
  postman[Scope]({
    data: []
  })
  postman[Iteration]()
  t.is(data.test, undef)
})

test.serial('data read set', t => {
  postman[Scope]({
    data: [ { test: 'a' } ]
  })
  postman[Iteration]()
  t.is(data.test, 'a')
})

test.serial('data write', t => {
  postman[Scope]({
    data: []
  })
  postman[Iteration]()
  t.throws(() => {
    data.test = 'a'
  })
})

test.serial('pm.variables.get data', t => {
  postman[Scope]({
    global: { test: 'a' },
    collection: { test: 'b' },
    environment: { test: 'c' },
    data: [ { test: 'd' } ]
  })
  postman[Iteration]()
  t.is(pm.variables.get('test'), 'd')
})

test.serial('pm.variables.get data iterated', t => {
  postman[Scope]({
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

test.serial('Var simple', t => {
  postman[Scope]({
    global: { test: 'a' }
  })
  t.is(pm[Var]('test'), 'a')
})

test.serial('$guid', t => {
  postman[Scope]()
  const value = pm[Var]('$guid')
  t.true(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(value))
})

test.serial('$randomInt', t => {
  postman[Scope]()
  const value = pm[Var]('$randomInt')
  t.true(value >= 0 && value <= 1000)
})

test.serial('$timestamp', t => {
  postman[Scope]()
  const value = pm[Var]('$timestamp')
  t.is(typeof value, 'number')
})
