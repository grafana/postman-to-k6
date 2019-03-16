/* global postman request */

import test from 'ava'
import mockRequire from 'mock-require'
let http

const undef = void 0

const Reset = Symbol.for('reset')
const Initial = Symbol.for('initial')
const Request = Symbol.for('request')

test.before(t => {
  mockRequire('k6/http', 'stub/http')
  http = require('k6/http')
  require('shim/core')
})

test.beforeEach(t => {
  http[Reset]()
  postman[Reset]()
})

test.serial('pre', t => {
  postman[Request]({
    pre () {
      t.pass()
    }
  })
})

test.serial('post', t => {
  postman[Request]({
    post () {
      t.pass()
    }
  })
})

test.serial('request', t => {
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

test.serial('request.data', t => {
  const data = {
    First: 'One',
    Second: 'Two',
    Third: 'Three'
  }
  postman[Request]({
    data,
    pre () {
      t.deepEqual(request.data, data)
    }
  })
})

test.serial('request.headers', t => {
  const headers = {
    First: 'One',
    Second: 'Two',
    Third: 'Three'
  }
  postman[Request]({
    headers,
    pre () {
      t.deepEqual(request.headers, headers)
    }
  })
})

test.serial('request.id', t => {
  postman[Request]({
    pre () {
      t.throws(() => {
        request.id /* eslint-disable-line no-unused-expressions */
      })
    }
  })
})

test.serial('request.method', t => {
  postman[Request]({
    method: 'get',
    pre () {
      t.is(request.method, 'GET')
    }
  })
})

test.serial('request.name', t => {
  postman[Request]({
    name: 'Test Request',
    pre () {
      t.is(request.name, 'Test Request')
    }
  })
})

test.serial('request.url', t => {
  postman[Request]({
    address: 'http://example.com',
    pre () {
      t.is(request.url, 'http://example.com')
    }
  })
})

test.serial('args', t => {
  postman[Request]({
    method: 'GET',
    address: 'http://example.com',
    data: { test: 'a', test2: 'b' },
    headers: { Test: 'a', Test2: 'b' },
    options: { auth: 'basic' }
  })
  t.true(http.request.calledOnce)
  const args = http.request.firstCall.args
  t.is(args[0], 'GET')
  t.is(args[1], 'http://example.com')
  t.deepEqual(args[2], { test: 'a', test2: 'b' })
  t.deepEqual(args[3], { auth: 'basic', headers: { Test: 'a', Test2: 'b' } })
})

test.serial('variable', t => {
  postman[Initial]({
    global: { domain: 'example.com', path: '/index.html' }
  })
  postman[Request]({
    address: 'http://{{domain}}{{path}}'
  })
  t.true(http.request.calledOnce)
  const args = http.request.firstCall.args
  t.is(args[1], 'http://example.com/index.html')
})
