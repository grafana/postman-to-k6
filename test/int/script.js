import test from 'ava';
import convertFile from 'convert/file';

test('pre request', async t => {
  const [main] = await convertFile('test/material/2/pre-request.json');
  t.snapshot(main);
});

test('pre collection', async t => {
  const [main] = await convertFile('test/material/2/pre-collection.json');
  t.snapshot(main);
});

test('pre folder', async t => {
  const [main] = await convertFile('test/material/2/pre-folder.json');
  t.snapshot(main);
});

test('pre nested', async t => {
  const [main] = await convertFile('test/material/2/pre-nested.json');
  t.snapshot(main);
});

test('post request', async t => {
  const [main] = await convertFile('test/material/2/post-request.json');
  t.snapshot(main);
});

test('post collection', async t => {
  const [main] = await convertFile('test/material/2/post-collection.json');
  t.snapshot(main);
});

test('post folder', async t => {
  const [main] = await convertFile('test/material/2/post-folder.json');
  t.snapshot(main);
});

test('post nested', async t => {
  const [main] = await convertFile('test/material/2/post-nested.json');
  t.snapshot(main);
});
