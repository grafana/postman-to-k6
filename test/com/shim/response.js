/* global postman pm */

import test from 'ava'
import mockRequire from 'mock-require'
let http

const Reset = Symbol.for('reset')
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

test.serial('pm.response.code', t => {
  http.request.returns({ status: 418 })
  postman[Request]({
    post () {
      t.is(pm.response.code, 418)
    }
  })
})

test.serial('pm.response.headers', t => {
  postman[Request]({
    post () {
      t.throws(() => {
        pm.response.headers /* eslint-disable-line no-unused-expressions */
      })
    }
  })
})

test.serial('pm.response.reason', t => {
  postman[Request]({
    post () {
      t.throws(() => {
        pm.response.reason()
      })
    }
  })
})

test.serial('pm.response.responseTime', t => {
  http.request.returns({ timings: { duration: 556 } })
  postman[Request]({
    post () {
      t.is(pm.response.responseTime, 556)
    }
  })
})

test.serial('pm.response.text string', t => {
  http.request.returns({ body: 'Response body' })
  postman[Request]({
    post () {
      t.is(pm.response.text(), 'Response body')
    }
  })
})

test.serial('pm.response.text binary', t => {
  http.request.returns({ body: [ 0x01, 0x02, 0x03 ] })
  postman[Request]({
    post () {
      t.is(pm.response.text(), null)
    }
  })
})
