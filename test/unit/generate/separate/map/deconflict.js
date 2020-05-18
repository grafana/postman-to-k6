import test from 'ava';
import deconflict from 'generate/separate/map/deconflict';

test('clear', t => {
  t.is(deconflict('apple', {}, {}), 'apple');
});

test('noncollision', t => {
  const container = { apple: {} };
  t.is(deconflict('orange', container, {}), 'orange');
});

test('collision', t => {
  const container = { apple: {} };
  t.is(deconflict('apple', container, {}), 'apple.A');
});

test('collision repeated', t => {
  const container = {
    apple: {},
    'apple.A': {},
    'apple.B': {}
  };
  t.is(deconflict('apple', container, {}), 'apple.C');
});

test('noncollision suffix', t => {
  const container = { apple: {} };
  t.is(deconflict('apple', container, {}, '.js'), 'apple');
});

test('collision suffix', t => {
  const container = { 'apple.js': {} };
  t.is(deconflict('apple', container, {}, '.js'), 'apple.A');
});

test('collision repeated suffix', t => {
  const container = {
    'apple.js': {},
    'apple.A.js': {},
    'apple.B.js': {}
  };
  t.is(deconflict('apple', container, {}, '.js'), 'apple.C');
});

test('generator reuse', t => {
  const container = {};
  const generators = {};
  t.is(deconflict('apple', container, generators), 'apple');
  container.apple = {};
  t.is(deconflict('apple', container, generators), 'apple.A');
  container['apple.A'] = {};
  t.is(deconflict('apple', container, generators), 'apple.B');
  t.is(generators.apple.next().value, 'C');
});
