/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import convertFile from 'convert/file';

test('request --k6-request-tagging=request', async t => {
  const options = {
    k6RequestTagging: 'request',
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});

test('request --k6-request-tagging=folder-request', async t => {
  const options = {
    k6RequestTagging: 'folder-request',
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});

test('request no request-tagging', async t => {
  const options = {
    k6RequestTagging: '',
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});

test('folder request --k6-request-tagging=request', async t => {
  const options = {
    k6RequestTagging: 'request',
  };
  const [main] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  t.snapshot(main);
});

test('folder request --k6-request-tagging=folder-request', async t => {
  const options = {
    k6RequestTagging: 'folder-request',
  };
  const [main] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  t.snapshot(main);
});

test('folder request no request-tagging', async t => {
  const options = {
    k6RequestTagging: '',
  };
  const [main] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  t.snapshot(main);
});

test('request separate --k6-request-tagging=request', async t => {
  const options = {
    separate: true,
    k6RequestTagging: 'request',
  };
  const [main, requests] = await convertFile(
    'test/material/2/request.json',
    options
  );
  // remove ID from requests
  let lines = requests['TestRequest.js'].split('\n');
  lines.splice(2, 1);
  requests['TestRequest.js'] = lines.join('\n');
  t.snapshot(requests);
});

test('request separate --k6-request-tagging=folder-request', async t => {
  const options = {
    separate: true,
    k6RequestTagging: 'folder-request',
  };
  const [main, requests] = await convertFile(
    'test/material/2/request.json',
    options
  );
  // remove ID from requests
  let lines = requests['TestRequest.js'].split('\n');
  lines.splice(2, 1);
  requests['TestRequest.js'] = lines.join('\n');
  t.snapshot(requests);
});

test('request separate no request-tagging', async t => {
  const options = {
    separate: true,
    k6RequestTagging: '',
  };
  const [main, requests] = await convertFile(
    'test/material/2/request.json',
    options
  );
  // remove ID from requests
  let lines = requests['TestRequest.js'].split('\n');
  lines.splice(2, 1);
  requests['TestRequest.js'] = lines.join('\n');
  t.snapshot(requests);
});

test('folder request separate --k6-request-tagging=request', async t => {
  const options = {
    separate: true,
    k6RequestTagging: 'request',
  };
  const [main, requests] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  // remove ID from requests
  let lines = requests['TestFolder']['TestRequest.js'].split('\n');
  lines.splice(2, 1);
  requests['TestFolder']['TestRequest.js'] = lines.join('\n');
  t.snapshot(requests);
});

test('folder request separate --k6-request-tagging=folder-request', async t => {
  const options = {
    separate: true,
    k6RequestTagging: 'folder-request',
  };
  const [main, requests] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  // remove ID from requests
  let lines = requests['TestFolder']['TestRequest.js'].split('\n');
  lines.splice(2, 1);
  requests['TestFolder']['TestRequest.js'] = lines.join('\n');
  t.snapshot(requests);
});

test('folder request separate no request-tagging', async t => {
  const options = {
    separate: true,
    k6RequestTagging: '',
  };
  const [main, requests] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  // remove ID from requests
  let lines = requests['TestFolder']['TestRequest.js'].split('\n');
  lines.splice(2, 1);
  requests['TestFolder']['TestRequest.js'] = lines.join('\n');
  t.snapshot(requests);
});
