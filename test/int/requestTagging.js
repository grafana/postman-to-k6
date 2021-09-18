/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import convertFile from 'convert/file';

test('request --request-tagging=request', async t => {
  const options = {
    requestTagging: 'request',
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});

test('request --request-tagging=folder-request', async t => {
  const options = {
    requestTagging: 'folder-request',
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});

test('request no request-tagging', async t => {
  const options = {
    requestTagging: '',
  };
  const [main] = await convertFile('test/material/2/request.json', options);
  t.snapshot(main);
});

test('folder request --request-tagging=request', async t => {
  const options = {
    requestTagging: 'request',
  };
  const [main] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  t.snapshot(main);
});

test('folder request --request-tagging=folder-request', async t => {
  const options = {
    requestTagging: 'folder-request',
  };
  const [main] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  t.snapshot(main);
});

test('folder request no request-tagging', async t => {
  const options = {
    requestTagging: '',
  };
  const [main] = await convertFile(
    'test/material/2/inherit-folder.json',
    options
  );
  t.snapshot(main);
});

test('request separate --request-tagging=request', async t => {
  const options = {
    separate: true,
    requestTagging: 'request',
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

test('request separate --request-tagging=folder-request', async t => {
  const options = {
    separate: true,
    requestTagging: 'folder-request',
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
    requestTagging: '',
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

test('folder request separate --request-tagging=request', async t => {
  const options = {
    separate: true,
    requestTagging: 'request',
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

test('folder request separate --request-tagging=folder-request', async t => {
  const options = {
    separate: true,
    requestTagging: 'folder-request',
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
    requestTagging: '',
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
