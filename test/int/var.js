/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import convertFile from 'convert/file';

test('global', async t => {
  const [main] = await convertFile('test/material/2/var-global.json', {
    globals: 'test/material/2/globals.json',
  });
  t.snapshot(main);
});

test('collection', async t => {
  const [main] = await convertFile('test/material/2/var-collection.json');
  t.snapshot(main);
});

test('environment', async t => {
  const [main] = await convertFile('test/material/2/var-environment.json', {
    environment: 'test/material/2/environment.json',
  });
  t.snapshot(main);
});

test('data json', async t => {
  const [main] = await convertFile('test/material/2/var-data-json.json', {
    json: 'test/material/2/data-json.json',
  });
  t.snapshot(main);
});

test('data csv', async t => {
  const [main] = await convertFile('test/material/2/var-data-csv.json', {
    csv: 'test/material/2/data-csv.csv',
  });
  t.snapshot(main);
});

test('data custom iterations', async t => {
  const [main] = await convertFile('test/material/2/var-data-json.json', {
    json: 'test/material/2/data-json.json',
    iterations: 27,
  });
  t.snapshot(main);
});

test('address start', async t => {
  const [main] = await convertFile('test/material/2/var-address-start.json');
  t.snapshot(main);
});
