import test from 'ava'
import mockRequire from 'mock-require'
import sinon from 'sinon'
const deconflict = sinon.stub()
const filenamify = sinon.stub()
let designate

test.before(t => {
  mockRequire(
    '../../../../../lib/generate/separate/map/deconflict',
    deconflict
  )
  mockRequire('filenamify', filenamify)
  designate = require('../../../../../lib/generate/separate/map/designate')
})

test.afterEach.always(t => {
  deconflict.reset()
  filenamify.reset()
})

test.serial('basic', t => {
  filenamify.returnsArg(0)
  deconflict.returnsArg(0)
  t.is(designate('apple', {}, {}), 'apple')
})

test.serial('suffix', t => {
  filenamify.returnsArg(0)
  deconflict.returnsArg(0)
  t.is(designate('apple', {}, {}, '.js'), 'apple.js')
})

test.serial('encode', t => {
  filenamify.returns('About!Company')
  deconflict.returnsArg(0)
  t.is(designate('About/Company', {}, {}), 'About!Company')
})

test.serial('deconflict', t => {
  filenamify.returnsArg(0)
  deconflict.returns('apple.A')
  t.is(designate('apple', {}, {}), 'apple.A')
})

test.serial('deconflict suffix', t => {
  filenamify.returnsArg(0)
  deconflict.returns('apple.A')
  t.is(designate('apple', {}, {}, '.js'), 'apple.A.js')
})
