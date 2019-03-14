/* global postman */

import test from 'ava'
import 'shim'

const Reset = Symbol.for('reset')

test.beforeEach(t => {
  postman[Reset]()
})

test('require', t => {
  t.throws(() => {
    global.require('console')
  })
})
