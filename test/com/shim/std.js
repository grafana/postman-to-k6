/* global postman */

import test from 'ava'
import mockRequire from 'mock-require'

const Reset = Symbol.for('reset')

test.before(t => {
  mockRequire('k6/http', { request: () => {} })
  require('shim/core')
})

test.beforeEach(t => {
  postman[Reset]()
})

test('require', t => {
  t.throws(() => {
    global.require('console')
  })
})
