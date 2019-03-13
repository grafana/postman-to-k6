/* global postman pm iteration */

import test from 'ava'
import 'shim'

const Reset = Symbol.for('reset')
const Initial = Symbol.for('initial')

test.beforeEach(t => {
  postman[Reset]()
})

test('iteration', t => {
  global.__ITER = 7
  t.is(iteration, 7)
})

test('pm.info.iteration', t => {
  global.__ITER = 5
  t.is(pm.info.iteration, 5)
})

test('pm.info.iterationCount default', t => {
  t.is(pm.info.iterationCount, 1)
})

test('pm.info.iterationCount custom', t => {
  postman[Initial]({ iterations: 25 })
  t.is(pm.info.iterationCount, 25)
})
