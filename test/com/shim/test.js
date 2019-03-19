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
  mockRequire('../../../lib/ajv.js', 'ajv')
  mockRequire('../../../lib/chai.js', 'chai')
  k6 = require('k6')
  http = require('k6/http')
  require('shim/core')
  require('shim/jsonSchema')
  require('shim/expect')
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

test.serial('pm.response.to.have.body exist fail', t => {
  http.request.returns({})
  expectFail(t)
  define(() => {
    pm.response.to.have.body()
  })
})

test.serial('pm.response.to.have.body exist pass', t => {
  http.request.returns({ body: 'Response body' })
  expectPass(t)
  define(() => {
    pm.response.to.have.body()
  })
})

test.serial('pm.response.to.have.body string fail', t => {
  http.request.returns({ body: 'Response body' })
  expectFail(t)
  define(() => {
    pm.response.to.have.body('Body')
  })
})

test.serial('pm.response.to.have.body string pass', t => {
  http.request.returns({ body: 'Response body' })
  expectPass(t)
  define(() => {
    pm.response.to.have.body('Response body')
  })
})

test.serial('pm.response.to.have.body regex fail', t => {
  http.request.returns({ body: 'Response body' })
  expectFail(t)
  define(() => {
    pm.response.to.have.body(/Test/)
  })
})

test.serial('pm.response.to.have.body regex pass', t => {
  http.request.returns({ body: 'Response body' })
  expectPass(t)
  define(() => {
    pm.response.to.have.body(/body/)
  })
})

test.serial('pm.response.to.have.header exist fail', t => {
  expectFail(t)
  define(() => {
    pm.response.to.have.header('Allow')
  })
})

test.serial('pm.response.to.have.header exist pass', t => {
  http.request.returns({ headers: { Allow: 'GET' } })
  expectPass(t)
  define(() => {
    pm.response.to.have.header('Allow')
  })
})

test.serial('pm.response.to.have.header value fail', t => {
  http.request.returns({ headers: { Allow: 'GET' } })
  expectFail(t)
  define(() => {
    pm.response.to.have.header('Allow', 'POST')
  })
})

test.serial('pm.response.to.have.header value pass', t => {
  http.request.returns({ headers: { Allow: 'GET' } })
  expectPass(t)
  define(() => {
    pm.response.to.have.header('Allow', 'GET')
  })
})

test.serial('pm.response.to.have.jsonBody exist fail', t => {
  http.request.returns({ body: 'not a json body' })
  expectFail(t)
  define(() => {
    pm.response.to.have.jsonBody()
  })
})

test.serial('pm.response.to.have.jsonBody exist pass', t => {
  http.request.returns({ body: '{"test":"a","test2":"b"}' })
  expectPass(t)
  define(() => {
    pm.response.to.have.jsonBody()
  })
})

test.serial('pm.response.to.have.jsonBody equal fail', t => {
  http.request.returns({ body: '{"test":"a","test2":"b"}' })
  expectFail(t)
  define(() => {
    pm.response.to.have.jsonBody({ test: 'a' })
  })
})

test.serial('pm.response.to.have.jsonBody equal pass', t => {
  http.request.returns({ body: '{"test":"a","test2":"b"}' })
  expectPass(t)
  define(() => {
    pm.response.to.have.jsonBody({ test: 'a', test2: 'b' })
  })
})

test.serial('pm.response.to.have.jsonBody path fail', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectFail(t)
  define(() => {
    pm.response.to.have.jsonBody('test2')
  })
})

test.serial('pm.response.to.have.jsonBody path pass', t => {
  http.request.returns({ body: '{"test":"a","test2":"b"}' })
  expectPass(t)
  define(() => {
    pm.response.to.have.jsonBody('test2')
  })
})

test.serial('pm.response.to.have.jsonBody value fail', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectFail(t)
  define(() => {
    pm.response.to.have.jsonBody('test', 'b')
  })
})

test.serial('pm.response.to.have.jsonBody value pass', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectPass(t)
  define(() => {
    pm.response.to.have.jsonBody('test', 'a')
  })
})

test.serial('pm.response.to.have.jsonSchema fail', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectFail(t)
  const schema = {
    properties: {
      test: { type: 'integer' }
    }
  }
  define(() => {
    pm.response.to.have.jsonSchema(schema)
  })
})

test.serial('pm.response.to.have.jsonSchema pass', t => {
  http.request.returns({ body: '{"test":7}' })
  expectPass(t)
  const schema = {
    properties: {
      test: { type: 'integer' }
    }
  }
  define(() => {
    pm.response.to.have.jsonSchema(schema)
  })
})

test.serial('pm.response.to.have.status invalid', t => {
  define(() => {
    t.throws(() => {
      pm.response.to.have.status(null)
    })
  })
})

test.serial('pm.response.to.have.status string', t => {
  define(() => {
    t.throws(() => {
      pm.response.to.have.status('OK')
    })
  })
})

test.serial('pm.response.to.have.status fail', t => {
  http.request.returns({ status: 404 })
  expectFail(t)
  define(() => {
    pm.response.to.have.status(200)
  })
})

test.serial('pm.response.to.have.status pass', t => {
  http.request.returns({ status: 200 })
  expectPass(t)
  define(() => {
    pm.response.to.have.status(200)
  })
})

test.serial('pm.response.to.not.be.accepted fail', t => {
  http.request.returns({ status: 202 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.accepted
  })
})

test.serial('pm.response.to.not.be.accepted pass', t => {
  http.request.returns({ status: 200 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.accepted
  })
})

test.serial('pm.response.to.not.be.badRequest fail', t => {
  http.request.returns({ status: 400 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.badRequest
  })
})

test.serial('pm.response.to.not.be.badRequest pass', t => {
  http.request.returns({ status: 401 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.badRequest
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

test.serial('pm.response.to.not.be.error 4xx', t => {
  http.request.returns({ status: 487 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.error
  })
})

test.serial('pm.response.to.not.be.error 5xx', t => {
  http.request.returns({ status: 523 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.error
  })
})

test.serial('pm.response.to.not.be.error pass', t => {
  http.request.returns({ status: 200 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.error
  })
})

test.serial('pm.response.to.not.be.forbidden fail', t => {
  http.request.returns({ status: 403 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.forbidden
  })
})

test.serial('pm.response.to.not.be.forbidden pass', t => {
  http.request.returns({ status: 400 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.forbidden
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

test.serial('pm.response.to.not.be.notFound fail', t => {
  http.request.returns({ status: 404 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.notFound
  })
})

test.serial('pm.response.to.not.be.notFound pass', t => {
  http.request.returns({ status: 400 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.notFound
  })
})

test.serial('pm.response.to.not.be.ok fail', t => {
  http.request.returns({ status: 200 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.ok
  })
})

test.serial('pm.response.to.not.be.ok pass', t => {
  http.request.returns({ status: 202 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.ok
  })
})

test.serial('pm.response.to.not.be.rateLimited fail', t => {
  http.request.returns({ status: 429 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.rateLimited
  })
})

test.serial('pm.response.to.not.be.rateLimited pass', t => {
  http.request.returns({ status: 400 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.rateLimited
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

test.serial('pm.response.to.not.be.serverError fail', t => {
  http.request.returns({ status: 584 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.serverError
  })
})

test.serial('pm.response.to.not.be.serverError pass', t => {
  http.request.returns({ status: 100 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.serverError
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

test.serial('pm.response.to.not.be.unauthorized fail', t => {
  http.request.returns({ status: 401 })
  expectFail(t)
  define(() => {
    pm.response.to.not.be.unauthorized
  })
})

test.serial('pm.response.to.not.be.unauthorized pass', t => {
  http.request.returns({ status: 400 })
  expectPass(t)
  define(() => {
    pm.response.to.not.be.unauthorized
  })
})

test.serial('pm.response.to.not.have.body exist fail', t => {
  http.request.returns({ body: 'Response body' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.body()
  })
})

test.serial('pm.response.to.not.have.body exist pass', t => {
  http.request.returns({})
  expectPass(t)
  define(() => {
    pm.response.to.not.have.body()
  })
})

test.serial('pm.response.to.not.have.body string fail', t => {
  http.request.returns({ body: 'Response body' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.body('Response body')
  })
})

test.serial('pm.response.to.not.have.body string pass', t => {
  http.request.returns({ body: 'Response body' })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.body('Body')
  })
})

test.serial('pm.response.to.not.have.body regex fail', t => {
  http.request.returns({ body: 'Response body' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.body(/body/)
  })
})

test.serial('pm.response.to.not.have.body regex pass', t => {
  http.request.returns({ body: 'Response body' })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.body(/Test/)
  })
})

test.serial('pm.response.to.not.have.header exist fail', t => {
  http.request.returns({ headers: { Allow: 'GET' } })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.header('Allow')
  })
})

test.serial('pm.response.to.not.have.header exist pass', t => {
  http.request.returns({ headers: { Server: 'MasterControlProgram' } })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.header('Allow')
  })
})

test.serial('pm.response.to.not.have.header value fail', t => {
  http.request.returns({ headers: { Server: 'MasterControlProgram' } })
  expectFail(t)
  define(() => {
    // do not deal with evil programs
    pm.response.to.not.have.header('Server', 'MasterControlProgram')
  })
})

test.serial('pm.response.to.not.have.header value pass clear', t => {
  expectPass(t)
  define(() => {
    pm.response.to.not.have.header('Server', 'MasterControlProgram')
  })
})

test.serial('pm.response.to.not.have.header value pass set', t => {
  http.request.returns({ headers: { Server: 'AlanHome' } })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.header('Server', 'MasterControlProgram')
  })
})

test.serial('pm.response.to.not.have.jsonBody exist fail', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.jsonBody()
  })
})

test.serial('pm.response.to.not.have.jsonBody exist pass', t => {
  http.request.returns({ body: 'Response body' })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.jsonBody()
  })
})

test.serial('pm.response.to.not.have.jsonBody equal fail', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.jsonBody({ test: 'a' })
  })
})

test.serial('pm.response.to.not.have.jsonBody equal pass', t => {
  http.request.returns({ body: '{"test":"b"}' })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.jsonBody({ test: 'a' })
  })
})

test.serial('pm.response.to.not.have.jsonBody path fail', t => {
  http.request.returns({ body: '{"test":"a","test2":"b"}' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.jsonBody('test2')
  })
})

test.serial('pm.response.to.not.have.jsonBody path pass', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.jsonBody('test2')
  })
})

test.serial('pm.response.to.not.have.jsonBody value fail', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.jsonBody('test', 'a')
  })
})

test.serial('pm.response.to.not.have.jsonBody value pass', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.jsonBody('test', 'b')
  })
})

test.serial('pm.response.to.not.have.jsonSchema fail', t => {
  http.request.returns({ body: '{"test":7}' })
  expectFail(t)
  const schema = {
    properties: {
      test: { type: 'integer' }
    }
  }
  define(() => {
    pm.response.to.not.have.jsonSchema(schema)
  })
})

test.serial('pm.response.to.not.have.jsonSchema pass', t => {
  http.request.returns({ body: '{"test":"a"}' })
  expectPass(t)
  const schema = {
    properties: {
      test: { type: 'integer' }
    }
  }
  define(() => {
    pm.response.to.not.have.jsonSchema(schema)
  })
})

test.serial('pm.response.to.not.have.status invalid', t => {
  define(() => {
    t.throws(() => {
      pm.response.to.not.have.status(null)
    })
  })
})

test.serial('pm.response.to.not.have.status string', t => {
  define(() => {
    t.throws(() => {
      pm.response.to.not.have.status('OK')
    })
  })
})

test.serial('pm.response.to.not.have.status fail', t => {
  http.request.returns({ status: 576 })
  expectFail(t)
  define(() => {
    pm.response.to.not.have.status(576)
  })
})

test.serial('pm.response.to.not.have.status pass', t => {
  http.request.returns({ status: 500 })
  expectPass(t)
  define(() => {
    pm.response.to.not.have.status(576)
  })
})

test.serial('pm.expect fail', t => {
  expectFail(t)
  define(() => {
    pm.expect('Response body').to.include('Test')
  })
})

test.serial('pm.expect pass', t => {
  expectPass(t)
  define(() => {
    pm.expect('Response body').to.include('Response')
  })
})
