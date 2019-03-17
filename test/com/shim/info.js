/* global postman pm iteration */

import test from 'ava'
import mockRequire from 'mock-require'
let k6, http

const Reset = Symbol.for('reset')
const Initial = Symbol.for('initial')
const Request = Symbol.for('request')

test.before(t => {
  mockRequire('k6', 'stub/k6')
  mockRequire('k6/http', 'stub/http')
  k6 = require('k6')
  http = require('k6/http')
  require('shim/core')
})

test.beforeEach(t => {
  k6[Reset]()
  http[Reset]()
  postman[Reset]()
})

test.serial('iteration', t => {
  global.__ITER = 7
  t.is(iteration, 7)
})

test.serial('pm.info.eventName pre', t => {
  postman[Request]({
    pre () {
      t.is(pm.info.eventName, 'prerequest')
    }
  })
})

test.serial('pm.info.eventName post', t => {
  postman[Request]({
    post () {
      t.is(pm.info.eventName, 'test')
    }
  })
})

test.serial('pm.info.iteration', t => {
  global.__ITER = 5
  t.is(pm.info.iteration, 5)
})

test.serial('pm.info.iterationCount default', t => {
  t.is(pm.info.iterationCount, 1)
})

test.serial('pm.info.iterationCount custom', t => {
  postman[Initial]({ iterations: 25 })
  t.is(pm.info.iterationCount, 25)
})

test.serial('pm.info.requestId', t => {
  postman[Request]({
    pre () {
      t.throws(() => {
        pm.info.requestId /* eslint-disable-line no-unused-expressions */
      })
    }
  })
})

test.serial('pm.info.requestName', t => {
  postman[Request]({
    name: 'Test Request',
    pre () {
      t.is(pm.info.requestName, 'Test Request')
    }
  })
})
