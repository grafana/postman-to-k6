import test from 'ava';
import convertFile from 'convert/file';

test('v1', async t => {
  const [main] = await convertFile('test/material/1/format-v1.json');
  t.snapshot(main);
});

test('v2', async t => {
  const [main] = await convertFile('test/material/2/format-v2.json');
  t.snapshot(main);
});

test('v2.1', async t => {
  const [main] = await convertFile('test/material/2.1/format-v2.1.json');
  t.snapshot(main);
});
