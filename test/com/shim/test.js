/* global postman pm tests */
/* eslint-disable no-unused-expressions */

import test from 'ava'
import mockRequire from 'mock-require'
let k6, http

const Reset = Symbol.for('reset')
const Request = Symbol.for('request')

function expectFail (t) {
  k6.check.callsFake((response, tests) => {
    t.false(tests.test(response))
  })
}

function expectPass (t) {
  k6.check.callsFake((response, tests) => {
    t.true(tests.test(response))
  })
}

function define (logic) {
  postman[Request]({
    post () {
      pm.test('test', logic)
    }
  })
}

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

test.serial('tests', t => {
  postman[Request]({
    post () {
      Object.assign(tests, {
        first: true,
        second: false,
        third: true
      })
    }
  })
  t.true(k6.check.calledThrice)
  const call1 = k6.check.getCall(0).args[1]
  t.true('first' in call1)
  t.true(call1.first())
  const call2 = k6.check.getCall(1).args[1]
  t.true('second' in call2)
  t.false(call2.second())
  const call3 = k6.check.getCall(2).args[1]
  t.true('third' in call3)
  t.true(call3.third())
})

test.serial('pm.test', t => {
  expectPass(t)
  define(() => {})
})

test.serial('pm.response.to.be.info fail', t => {
  http.request.returns({ status: 200 })
  expectFail(t)
  define(() => {
    pm.response.to.be.info
  })
})

test.serial('pm.response.to.be.info pass', t => {
  http.request.returns({ status: 156 })
  expectPass(t)
  define(() => {
    pm.response.to.be.info
  })
})

test.serial('pm.response.to.not.be.info fail', t => {
  http.request.returns({ status: 156 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.info
  })
})

test.serial('pm.response.to.not.be.info pass', t => {
  http.request.returns({ status: 200 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.info
  })
})
