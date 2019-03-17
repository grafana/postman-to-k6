/* global postman */
/* global responseCookies */

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

test.serial('responseCookies', t => {
  const cookie = {
    domain: 'example.com',
    httpOnly: false,
    name: 'Theme',
    path: '/',
    secure: false,
    value: 'Aqua'
  }
  http.request.returns({ cookies: { Theme: [ cookie ] } })
  postman[Request]({
    post () {
      t.is(responseCookies.length, 1)
      const responseCookie = responseCookies[0]
      for (const key of Object.keys(cookie)) {
        t.is(responseCookie[key], cookie[key])
      }
    }
  })
})

test.serial('cookie.hostOnly', t => {
  http.request.returns({ cookies: { Theme: [ {} ] } })
  postman[Request]({
    post () {
      t.throws(() => {
        /* eslint-disable-next-line no-unused-expressions */
        responseCookies[0].hostOnly
      })
    }
  })
})

test.serial('cookie.session', t => {
  http.request.returns({ cookies: { Theme: [ {} ] } })
  postman[Request]({
    post () {
      t.throws(() => {
        /* eslint-disable-next-line no-unused-expressions */
        responseCookies[0].session
      })
    }
  })
})

test.serial('cookie.storeId', t => {
  http.request.returns({ cookies: { Theme: [ {} ] } })
  postman[Request]({
    post () {
      t.throws(() => {
        /* eslint-disable-next-line no-unused-expressions */
        responseCookies[0].storeId
      })
    }
  })
})
