/* global postman xml2Json xmlToJson */

import test from 'ava'
import mockRequire from 'mock-require'

const Reset = Symbol.for('reset')

test.before(t => {
  mockRequire('../../../lib/xml2js.js', 'xml2js')
  require('shim')
})

test.beforeEach(t => {
  postman[Reset]()
})

test('xml2Json', t => {
  const xml = '<root>Text</root>'
  const json = xml2Json(xml)
  t.deepEqual(json, { root: 'Text' })
})

test('xmlToJson', t => {
  t.throws(() => {
    xmlToJson()
  })
})
