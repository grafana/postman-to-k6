/* global postman globals */

import test from 'ava'
import 'shim'

const undef = void 0
const Reset = Symbol.for('reset')
const Scope = Symbol.for('scope')

test.beforeEach(t => {
  postman[Reset]()
})

test.serial('globals read clear', t => {
  postman[Scope]()
  t.is(globals.test, undef)
})

test.serial('globals read set', t => {
  postman[Scope]({ globals: { test: 6 } })
  t.is(globals.test, 6)
})

test.serial('globals write', t => {
  postman[Scope]()
  t.throws(() => {
    globals.test = 8
  })
})

test.serial('getGlobalVariable clear', t => {
  postman[Scope]()
  t.is(postman.getGlobalVariable('test'), undef)
})

test.serial('getGlobalVariable set', t => {
  postman[Scope]({ globals: { test: 8 } })
  t.is(postman.getGlobalVariable('test'), 8)
})

test.serial('setGlobalVariable clear', t => {
  postman[Scope]()
  postman.setGlobalVariable('test', 8)
  t.is(globals.test, 8)
})

test.serial('setGlobalVariable set', t => {
  postman[Scope]({ globals: { test: 8 } })
  postman.setGlobalVariable('test', 10)
  t.is(globals.test, 10)
})

test.serial('clearGlobalVariable', t => {
  postman[Scope]({ globals: { test: 8 } })
  t.is(globals.test, 8)
  postman.clearGlobalVariable('test')
  t.is(globals.test, undef)
})

test.serial('clearGlobalVariables', t => {
  postman[Scope]({ globals: { test: 8, test2: 10 } })
  t.is(globals.test, 8)
  t.is(globals.test2, 10)
  postman.clearGlobalVariables()
  t.is(globals.test, undef)
  t.is(globals.test2, undef)
})
