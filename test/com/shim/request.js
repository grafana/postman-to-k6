/* global postman request */

import test from 'ava'
import mockRequire from 'mock-require'

const undef = void 0

const Reset = Symbol.for('reset')
const Request = Symbol.for('request')

test.before(t => {
  mockRequire('k6/http', { request: () => {} })
  require('shim/core')
})

test.beforeEach(t => {
  postman[Reset]()
})

test('request', t => {
  t.plan(4)
  t.is(request, undef)
  postman[Request]([], () => {
    t.is(typeof request, 'object')
  }, () => {
    t.is(typeof request, 'object')
  })
  t.is(request, undef)
})

test('request.method', t => {
  postman[Request]([ 'get' ], () => {
    t.is(request.method, 'GET')
  })
})
