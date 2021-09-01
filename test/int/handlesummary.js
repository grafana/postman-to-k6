import test from 'ava';
import convertFile from 'convert/file';

test('k6 handle-summary json', async t => {
  const options = {
    k6HandleSummary: {
      json: 'k6-handle-summary.json',
    },
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});
