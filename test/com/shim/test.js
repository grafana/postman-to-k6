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

test.serial('pm.response.to.be.accepted fail', t => {
  http.request.returns({ status: 200 })
  expectFail(t)
  define(() => {
    pm.response.to.be.accepted
  })
})

test.serial('pm.response.to.be.accepted pass', t => {
  http.request.returns({ status: 202 })
  expectPass(t)
  define(() => {
    pm.response.to.be.accepted
  })
})

test.serial('pm.response.to.be.badRequest fail', t => {
  http.request.returns({ status: 476 })
  expectFail(t)
  define(() => {
    pm.response.to.be.badRequest
  })
})

test.serial('pm.response.to.be.badRequest pass', t => {
  http.request.returns({ status: 400 })
  expectPass(t)
  define(() => {
    pm.response.to.be.badRequest
  })
})

test.serial('pm.response.to.be.clientError fail', t => {
  http.request.returns({ status: 100 })
  expectFail(t)
  define(() => {
    pm.response.to.be.clientError
  })
})

test.serial('pm.response.to.be.clientError pass', t => {
  http.request.returns({ status: 473 })
  expectPass(t)
  define(() => {
    pm.response.to.be.clientError
  })
})

test.serial('pm.response.to.be.error fail', t => {
  http.request.returns({ status: 100 })
  expectFail(t)
  define(() => {
    pm.response.to.be.error
  })
})

test.serial('pm.response.to.be.error 4xx', t => {
  http.request.returns({ status: 498 })
  expectPass(t)
  define(() => {
    pm.response.to.be.error
  })
})

test.serial('pm.response.to.be.error 5xx', t => {
  http.request.returns({ status: 543 })
  expectPass(t)
  define(() => {
    pm.response.to.be.error
  })
})

test.serial('pm.response.to.be.forbidden fail', t => {
  http.request.returns({ status: 400 })
  expectFail(t)
  define(() => {
    pm.response.to.be.forbidden
  })
})

test.serial('pm.response.to.be.forbidden pass', t => {
  http.request.returns({ status: 403 })
  expectPass(t)
  define(() => {
    pm.response.to.be.forbidden
  })
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

test.serial('pm.response.to.be.notFound fail', t => {
  http.request.returns({ status: 400 })
  expectFail(t)
  define(() => {
    pm.response.to.be.notFound
  })
})

test.serial('pm.response.to.be.notFound pass', t => {
  http.request.returns({ status: 404 })
  expectPass(t)
  define(() => {
    pm.response.to.be.notFound
  })
})

test.serial('pm.response.to.be.ok fail', t => {
  http.request.returns({ status: 202 })
  expectFail(t)
  define(() => {
    pm.response.to.be.ok
  })
})

test.serial('pm.response.to.be.ok pass', t => {
  http.request.returns({ status: 200 })
  expectPass(t)
  define(() => {
    pm.response.to.be.ok
  })
})

test.serial('pm.response.to.be.rateLimited fail', t => {
  http.request.returns({ status: 400 })
  expectFail(t)
  define(() => {
    pm.response.to.be.rateLimited
  })
})

test.serial('pm.response.to.be.rateLimited pass', t => {
  http.request.returns({ status: 429 })
  expectPass(t)
  define(() => {
    pm.response.to.be.rateLimited
  })
})

test.serial('pm.response.to.be.redirection fail', t => {
  http.request.returns({ status: 100 })
  expectFail(t)
  define(() => {
    pm.response.to.be.redirection
  })
})

test.serial('pm.response.to.be.redirection pass', t => {
  http.request.returns({ status: 344 })
  expectPass(t)
  define(() => {
    pm.response.to.be.redirection
  })
})

test.serial('pm.response.to.be.serverError fail', t => {
  http.request.returns({ status: 100 })
  expectFail(t)
  define(() => {
    pm.response.to.be.serverError
  })
})

test.serial('pm.response.to.be.serverError pass', t => {
  http.request.returns({ status: 523 })
  expectPass(t)
  define(() => {
    pm.response.to.be.serverError
  })
})

test.serial('pm.response.to.be.success fail', t => {
  http.request.returns({ status: 100 })
  expectFail(t)
  define(() => {
    pm.response.to.be.success
  })
})

test.serial('pm.response.to.be.success pass', t => {
  http.request.returns({ status: 275 })
  expectPass(t)
  define(() => {
    pm.response.to.be.success
  })
})

test.serial('pm.response.to.be.unauthorized fail', t => {
  http.request.returns({ status: 400 })
  expectFail(t)
  define(() => {
    pm.response.to.be.unauthorized
  })
})

test.serial('pm.response.to.be.unauthorized pass', t => {
  http.request.returns({ status: 401 })
  expectPass(t)
  define(() => {
    pm.response.to.be.unauthorized
  })
})

test.serial('pm.response.to.not.be.clientError fail', t => {
  http.request.returns({ status: 434 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.clientError
  })
})

test.serial('pm.response.to.not.be.clientError pass', t => {
  http.request.returns({ status: 100 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.clientError
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

test.serial('pm.response.to.not.be.redirection fail', t => {
  http.request.returns({ status: 387 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.redirection
  })
})

test.serial('pm.response.to.not.be.redirection pass', t => {
  http.request.returns({ status: 100 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.redirection
  })
})

test.serial('pm.response.to.not.be.success fail', t => {
  http.request.returns({ status: 254 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.success
  })
})

test.serial('pm.response.to.not.be.success pass', t => {
  http.request.returns({ status: 100 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.success
  })
})
