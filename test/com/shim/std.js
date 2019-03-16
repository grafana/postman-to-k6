/* global postman */

import test from 'ava'
import mockRequire from 'mock-require'
let http

const Reset = Symbol.for('reset')
const Request = Symbol.for('request')

test.before(t => {
  global.require = require // Simulate k6 global require
  mockRequire('k6/http', 'stub/http')
  http = require('k6/http')
  require('shim/core')
})

test.beforeEach(t => {
  http[Reset]()
  postman[Reset]()
})

test.serial('require standard', t => {
  t.notThrows(() => {
    global.require('console')
  })
})

test.serial('require prerequest', t => {
  postman[Request]({
    pre () {
      t.throws(() => {
        global.require('console')
      })
    }
  })
})

test.serial('require postrequest', t => {
  postman[Request]({
    post () {
      t.throws(() => {
        global.require('console')
      })
    }
  })
})

test.serial('require released', t => {
  postman[Request]({})
  t.notThrows(() => {
    global.require('console')
  })
})
