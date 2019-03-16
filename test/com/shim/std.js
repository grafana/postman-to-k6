/* global postman */

import test from 'ava'
import mockRequire from 'mock-require'

const Reset = Symbol.for('reset')
const Request = Symbol.for('request')

test.before(t => {
  global.require = require // Simulate k6 global require
  mockRequire('k6/http', 'stub/http')
  require('shim/core')
})

test.beforeEach(t => {
  postman[Reset]()
})

test('require standard', t => {
  t.notThrows(() => {
    global.require('console')
  })
})

test('require prerequest', t => {
  postman[Request]({
    pre () {
      t.throws(() => {
        global.require('console')
      })
    }
  })
})

test('require postrequest', t => {
  postman[Request]({
    post () {
      t.throws(() => {
        global.require('console')
      })
    }
  })
})

test('require released', t => {
  postman[Request]({})
  t.notThrows(() => {
    global.require('console')
  })
})
