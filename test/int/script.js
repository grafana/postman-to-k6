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

test('pre request --skip-pre', async t => {
  const options = {
    skip: {
      pre: true,
    },
  };
  const [main] = await convertFile('test/material/2/pre-request.json', options);
  t.snapshot(main);
});

test('pre collection --skip-pre', async t => {
  const options = {
    skip: {
      pre: true,
    },
  };
  const [main] = await convertFile(
    'test/material/2/pre-collection.json',
    options
  );
  t.snapshot(main);
});

test('pre folder --skip-pre', async t => {
  const options = {
    skip: {
      pre: true,
    },
  };
  const [main] = await convertFile('test/material/2/pre-folder.json', options);
  t.snapshot(main);
});

test('pre nested --skip-pre', async t => {
  const options = {
    skip: {
      pre: true,
    },
  };
  const [main] = await convertFile('test/material/2/pre-nested.json', options);
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

test('post request --skip-pre', async t => {
  const options = {
    skip: {
      post: true,
    },
  };
  const [main] = await convertFile(
    'test/material/2/post-request.json',
    options
  );
  t.snapshot(main);
});

test('post collection --skip-pre', async t => {
  const options = {
    skip: {
      post: true,
    },
  };
  const [main] = await convertFile(
    'test/material/2/post-collection.json',
    options
  );
  t.snapshot(main);
});

test('post folder --skip-pre', async t => {
  const options = {
    skip: {
      post: true,
    },
  };
  const [main] = await convertFile('test/material/2/post-folder.json', options);
  t.snapshot(main);
});

test('post nested --skip-pre', async t => {
  const options = {
    skip: {
      post: true,
    },
  };
  const [main] = await convertFile('test/material/2/post-nested.json', options);
  t.snapshot(main);
});
