/* global postman pm */

import test from 'ava'
import 'shim'

const Reset = Symbol.for('reset')

test.beforeEach(t => {
  postman[Reset]()
})

test('iteration', t => {
  global.__ITER = 5
  t.is(pm.info.iteration, 5)
})
