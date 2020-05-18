import test from 'ava';
import mockRequire from 'mock-require';
import sinon from 'sinon';
const deconflict = sinon.stub();
let designate;

test.before(t => {
  mockRequire(
    '../../../../../lib/generate/separate/map/deconflict',
    deconflict
  );
  designate = require('../../../../../lib/generate/separate/map/designate');
});

test.afterEach.always(t => {
  deconflict.reset();
});

test.serial('basic', t => {
  deconflict.returnsArg(0);
  t.is(designate('apple', {}, {}), 'apple');
});

test.serial('suffix', t => {
  deconflict.returnsArg(0);
  t.is(designate('apple', {}, {}, '.js'), 'apple.js');
});

test.serial('encode', t => {
  deconflict.returnsArg(0);
  t.is(designate('About/Company', {}, {}), 'AboutCompany');
});

test.serial('deconflict', t => {
  deconflict.returns('apple.A');
  t.is(designate('apple', {}, {}), 'apple.A');
});

test.serial('deconflict suffix', t => {
  deconflict.returns('apple.A');
  t.is(designate('apple', {}, {}, '.js'), 'apple.A.js');
});
