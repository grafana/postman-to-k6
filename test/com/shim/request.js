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

test('pre', t => {
  postman[Request]({
    pre () {
      t.pass()
    }
  })
})

test('post', t => {
  postman[Request]({
    post () {
      t.pass()
    }
  })
})

test('request', t => {
  t.plan(4)
  t.is(request, undef)
  postman[Request]({
    pre () {
      t.is(typeof request, 'object')
    },
    post () {
      t.is(typeof request, 'object')
    }
  })
  t.is(request, undef)
})

test('request.method', t => {
  postman[Request]({
    method: 'get',
    pre () {
      t.is(request.method, 'GET')
    }
  })
})

test('request.name', t => {
  postman[Request]({
    name: 'Test Request',
    pre () {
      t.is(request.name, 'Test Request')
    }
  })
})

test('request.url', t => {
  postman[Request]({
    address: 'http://example.com',
    pre () {
      t.is(request.url, 'http://example.com')
    }
  })
})
