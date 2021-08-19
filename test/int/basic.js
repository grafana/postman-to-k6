/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import convertFile from 'convert/file';

test('minimal', async t => {
  const [main] = await convertFile('test/material/2/minimal.json');
  t.is(main, '// No HTTP/HTTPS transactions have been recorded');
});

test('request', async t => {
  const [main] = await convertFile('test/material/2/request.json');
  t.snapshot(main);
});

test('raw body', async t => {
  const [main] = await convertFile('test/material/2/body-raw.json');
  t.snapshot(main);
});

test('form body text', async t => {
  const [main] = await convertFile('test/material/2/body-form.json');
  t.snapshot(main);
});

test('form body file', async t => {
  const [main] = await convertFile('test/material/2.1/upload.json');
  t.snapshot(main);
});

test('url body', async t => {
  const [main] = await convertFile('test/material/2/body-url.json');
  t.snapshot(main);
});

test('no body alternate', async t => {
  const [main] = await convertFile('test/material/2.1/no-body-alternate.json');
  t.snapshot(main);
});

test('iterations', async t => {
  const [main] = await convertFile('test/material/2/request.json', {
    iterations: 25,
  });
  t.snapshot(main);
});
