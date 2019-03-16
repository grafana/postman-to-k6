/* global postman pm iteration */

import test from 'ava'
import mockRequire from 'mock-require'

const Reset = Symbol.for('reset')
const Initial = Symbol.for('initial')
const Request = Symbol.for('request')

test.before(t => {
  mockRequire('k6/http', 'stub/http')
  require('shim/core')
})

test.beforeEach(t => {
  postman[Reset]()
})

test('iteration', t => {
  global.__ITER = 7
  t.is(iteration, 7)
})

test('pm.info.eventName pre', t => {
  postman[Request]({
    pre () {
      t.is(pm.info.eventName, 'prerequest')
    }
  })
})

test('pm.info.eventName post', t => {
  postman[Request]({
    post () {
      t.is(pm.info.eventName, 'test')
    }
  })
})

test('pm.info.iteration', t => {
  global.__ITER = 5
  t.is(pm.info.iteration, 5)
})

test('pm.info.iterationCount default', t => {
  t.is(pm.info.iterationCount, 1)
})

test('pm.info.iterationCount custom', t => {
  postman[Initial]({ iterations: 25 })
  t.is(pm.info.iterationCount, 25)
})

test('pm.info.requestId', t => {
  postman[Request]({
    pre () {
      t.throws(() => {
        pm.info.requestId /* eslint-disable-line no-unused-expressions */
      })
    }
  })
})

test('pm.info.requestName', t => {
  postman[Request]({
    name: 'Test Request',
    pre () {
      t.is(pm.info.requestName, 'Test Request')
    }
  })
})
