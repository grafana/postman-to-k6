import test from 'ava';
import mockRequire from 'mock-require';
import { Auth } from 'generate/separate/sym';
let map;

function designate(name, container, generators, suffix = '') {
  return name + suffix;
}

test.before(t => {
  mockRequire(
    '../../../../../lib/generate/separate/map/designate.js',
    designate
  );
  map = require('../../../../../lib/generate/separate/map/index.js');
});

test('empty', t => {
  const tree = { items: [], locations: [] };
  const result = map(tree);
  t.deepEqual(result, {});
});

test('1 item', t => {
  const tree = {
    items: [{ name: 'apple' }],
    locations: []
  };
  const result = map(tree);
  t.deepEqual(result, {
    'apple.js': { name: 'apple' }
  });
});

test('3 items', t => {
  const tree = {
    items: [
      { name: 'apple' },
      { name: 'orange' },
      { name: 'pear' }
    ],
    locations: []
  };
  const result = map(tree);
  t.deepEqual(result, {
    'apple.js': { name: 'apple' },
    'orange.js': { name: 'orange' },
    'pear.js': { name: 'pear' }
  });
});

test('1 location', t => {
  const tree = {
    items: [],
    locations: [{ name: 'setup', items: [], locations: [] }]
  };
  const result = map(tree);
  t.deepEqual(result, {
    setup: {}
  });
});

test('3 locations', t => {
  const tree = {
    items: [],
    locations: [
      { name: 'setup', items: [], locations: [] },
      { name: 'exercise', items: [], locations: [] },
      { name: 'cleanup', items: [], locations: [] }
    ]
  };
  const result = map(tree);
  t.deepEqual(result, {
    setup: {},
    exercise: {},
    cleanup: {}
  });
});

test('auth', t => {
  const auth = Symbol('auth');
  const tree = {
    auth,
    items: [],
    locations: []
  };
  const result = map(tree);
  t.deepEqual(result, { [Auth]: auth });
});

test('nested item', t => {
  const tree = {
    items: [],
    locations: [
      {
        name: 'exercise',
        items: [{ name: 'home' }],
        locations: []
      }
    ]
  };
  const result = map(tree);
  t.deepEqual(result, {
    exercise: {
      'home.js': { name: 'home' }
    }
  });
});

test('nested location', t => {
  const tree = {
    items: [],
    locations: [
      {
        name: 'exercise',
        items: [],
        locations: [{ name: 'public', items: [], locations: [] }]
      }
    ]
  };
  const result = map(tree);
  t.deepEqual(result, {
    exercise: {
      public: {}
    }
  });
});
