/* global postman pm */

import test from 'ava'
import 'shim'

const Reset = Symbol.for('reset')
const Initial = Symbol.for('initial')

test.beforeEach(t => {
  postman[Reset]()
})

test('iteration', t => {
  global.__ITER = 5
  t.is(pm.info.iteration, 5)
})

test('iterationCount default', t => {
  t.is(pm.info.iterationCount, 1)
})

test('iterationCount custom', t => {
  postman[Initial]({ iterations: 25 })
  t.is(pm.info.iterationCount, 25)
})
