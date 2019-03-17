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