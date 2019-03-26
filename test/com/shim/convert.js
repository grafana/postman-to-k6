/* global postman xml2Json xmlToJson */

import test from 'ava'
import mockRequire from 'mock-require'
let k6, http

const Reset = Symbol.for('reset')

test.before(t => {
  mockRequire('k6', 'stub/k6')
  mockRequire('k6/http', 'stub/http')
  mockRequire('../../../lib/xml2js.js', 'xml2js')
  k6 = require('k6')
  http = require('k6/http')
  require('shim/core')
  require('shim/xml2Json')
})

test.afterEach.always(t => {
  k6[Reset]()
  http[Reset]()
  postman[Reset]()
})

test.serial('xml2Json', t => {
  const xml = '<root>Text</root>'
  const json = xml2Json(xml)
  t.deepEqual(json, { root: 'Text' })
})

test.serial('xmlToJson', t => {
  t.throws(() => {
    xmlToJson()
  })
})
