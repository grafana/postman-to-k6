/* global postman pm iteration */

import test from 'ava'
import mockRequire from 'mock-require'
import uuidv4 from 'uuid/v4'
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

test.afterEach.always(t => {
  k6[Reset]()
  http[Reset]()
  postman[Reset]()
  delete global.__ITER
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

test.serial('pm.info.iterationCount clear', t => {
  const options = {}
  postman[Initial]({ options })
  t.is(pm.info.iterationCount, Number.POSITIVE_INFINITY)
})

test.serial('pm.info.iterationCount set', t => {
  const options = { iterations: 25 }
  postman[Initial]({ options })
  t.is(pm.info.iterationCount, 25)
})

test.serial('pm.info.requestId', t => {
  const id = uuidv4()
  postman[Request]({
    id,
    pre () {
      t.is(pm.info.requestId, id)
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
