/* global postman pm */
/* global responseBody responseCode responseHeaders responseTime */

import test from 'ava';
import mockRequire from 'mock-require';
let k6, http;

const Reset = Symbol.for('reset');
const Request = Symbol.for('request');

test.before(t => {
  mockRequire('k6', 'stub/k6');
  mockRequire('k6/http', 'stub/http');
  k6 = require('k6');
  http = require('k6/http');
  require('shim/core');
});

test.afterEach.always(t => {
  k6[Reset]();
  http[Reset]();
  postman[Reset]();
});

test.serial('responseBody', t => {
  http.request.returns({ body: 'Response body' });
  postman[Request]({
    post() {
      t.is(responseBody, 'Response body');
    }
  });
});

test.serial('responseCode.code', t => {
  http.request.returns({ status: 418 });
  postman[Request]({
    post() {
      t.is(responseCode.code, 418);
    }
  });
});

test.serial('responseCode.detail', t => {
  postman[Request]({
    post() {
      t.throws(() => {
        responseCode.detail; /* eslint-disable-line no-unused-expressions */
      });
    }
  });
});

test.serial('responseCode.name', t => {
  postman[Request]({
    post() {
      t.throws(() => {
        responseCode.name; /* eslint-disable-line no-unused-expressions */
      });
    }
  });
});

test.serial('responseHeaders', t => {
  http.request.returns({
    headers: {
      Server: 'MasterControlProgram',
      Allow: 'GET, POST, HEAD'
    }
  });
  postman[Request]({
    post() {
      t.deepEqual(responseHeaders, {
        Server: 'MasterControlProgram',
        Allow: 'GET, POST, HEAD'
      });
    }
  });
});

test.serial('responseTime', t => {
  http.request.returns({ timings: { duration: 556 } });
  postman[Request]({
    post() {
      t.is(responseTime, 556);
    }
  });
});

test.serial('postman.getResponseHeader', t => {
  http.request.returns({ headers: { Server: 'MasterControlProgram' } });
  postman[Request]({
    post() {
      t.is(postman.getResponseHeader('server'), 'MasterControlProgram');
    }
  });
});

test.serial('pm.response.code', t => {
  http.request.returns({ status: 418 });
  postman[Request]({
    post() {
      t.is(pm.response.code, 418);
    }
  });
});

test.serial('pm.response.headers', t => {
  postman[Request]({
    post() {
      t.throws(() => {
        pm.response.headers; /* eslint-disable-line no-unused-expressions */
      });
    }
  });
});

test.serial('pm.response.json', t => {
  http.request.returns({ body: '{ "test": "a", "test2": "b" }' });
  postman[Request]({
    post() {
      t.deepEqual(pm.response.json(), { test: 'a', test2: 'b' });
    }
  });
});

test.serial('pm.response.reason', t => {
  postman[Request]({
    post() {
      t.throws(() => {
        pm.response.reason();
      });
    }
  });
});

test.serial('pm.response.responseTime', t => {
  http.request.returns({ timings: { duration: 556 } });
  postman[Request]({
    post() {
      t.is(pm.response.responseTime, 556);
    }
  });
});

test.serial('pm.response.text string', t => {
  http.request.returns({ body: 'Response body' });
  postman[Request]({
    post() {
      t.is(pm.response.text(), 'Response body');
    }
  });
});

test.serial('pm.response.text binary', t => {
  http.request.returns({ body: [0x01, 0x02, 0x03] });
  postman[Request]({
    post() {
      t.is(pm.response.text(), null);
    }
  });
});
