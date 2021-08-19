/* eslint-disable no-template-curly-in-string */

import test from 'ava';
import convertFile from 'convert/file';

test('noauth', async t => {
  const [main] = await convertFile('test/material/2/noauth.json');
  t.snapshot(main);
});

test('basic', async t => {
  const [main] = await convertFile('test/material/2/basic.json');
  t.snapshot(main);
});

test('bearer', async t => {
  const [main] = await convertFile('test/material/2/bearer.json');
  t.snapshot(main);
});

test('digest', async t => {
  const [main] = await convertFile('test/material/2/digest.json');
  t.snapshot(main);
});

test('ntlm', async t => {
  const [main] = await convertFile('test/material/2/ntlm.json');
  t.snapshot(main);
});

test('awsv4', async t => {
  const [main] = await convertFile('test/material/2/awsv4.json');
  t.snapshot(main);
});

test('oauth1 header sha1', async t => {
  const [main] = await convertFile('test/material/2/oauth1-header-sha1.json');
  t.snapshot(main);
});

test('oauth1 header sha256', async t => {
  const [main] = await convertFile('test/material/2/oauth1-header-sha256.json');
  t.snapshot(main);
});

test('oauth1 header text', async t => {
  const [main] = await convertFile('test/material/2/oauth1-header-text.json');
  t.snapshot(main);
});

test('oauth1 body', async t => {
  const [main] = await convertFile('test/material/2/oauth1-body.json');
  t.snapshot(main);
});

test('oauth1 address', async t => {
  const [main] = await convertFile('test/material/2/oauth1-address.json');
  t.snapshot(main);
});

test('oauth2 header', async t => {
  const [main] = await convertFile('test/material/2/oauth2-header.json');
  t.snapshot(main);
});

test('oauth2 address', async t => {
  const [main] = await convertFile('test/material/2/oauth2-address.json');
  t.snapshot(main);
});

test('inherit collection', async t => {
  const [main] = await convertFile('test/material/2/inherit-collection.json');
  t.snapshot(main);
});

test('inherit folder', async t => {
  const [main] = await convertFile('test/material/2/inherit-folder.json');
  t.snapshot(main);
});

test('inherit nested', async t => {
  const [main] = await convertFile('test/material/2/inherit-nested.json');
  t.snapshot(main);
});

test('apikey', async t => {
  const [main] = await convertFile('test/material/2/apikey.json');
  t.snapshot(main);
});
