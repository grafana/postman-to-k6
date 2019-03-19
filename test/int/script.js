import test from 'ava'
import convertFile from 'convert/file'

test('pre request', t => {
  const result = convertFile('test/material/2/pre-request.json')
  t.is(result, `// Auto-generated by the Load Impact converter

import "./postman-shim.js";

export let options = { maxRedirects: 4 };

const Request = Symbol.for("request");

export default function() {
  postman[Request]({
    name: "TestRequest",
    method: "GET",
    address: "http://example.com",
    pre() {
      pm.variables.set("test", "a");
      pm.variables.set("test2", "b");
      pm.variables.set("test3", "c");
    }
  });
}
`)
})

test('pre collection', t => {
  const result = convertFile('test/material/2/pre-collection.json')
  t.is(result, `// Auto-generated by the Load Impact converter

import "./postman-shim.js";

export let options = { maxRedirects: 4 };

const Pre = Symbol.for("pre");
const Request = Symbol.for("request");

export default function() {
  postman[Pre].push(() => {
    pm.variables.set("test", "a");
    pm.variables.set("test2", "b");
    pm.variables.set("test3", "c");
  });

  postman[Request]({
    name: "TestRequest",
    method: "GET",
    address: "http://example.com"
  });

  postman[Pre].pop();
}
`)
})

test('pre folder', t => {
  const result = convertFile('test/material/2/pre-folder.json')
  t.is(result, `// Auto-generated by the Load Impact converter

import "./postman-shim.js";
import { group } from "k6";

export let options = { maxRedirects: 4 };

const Pre = Symbol.for("pre");
const Request = Symbol.for("request");

export default function() {
  group("TestFolder", function() {
    postman[Pre].push(() => {
      pm.variables.set("test", "a");
      pm.variables.set("test2", "b");
      pm.variables.set("test3", "c");
    });

    postman[Request]({
      name: "TestRequest",
      method: "GET",
      address: "http://example.com"
    });

    postman[Pre].pop();
  });
}
`)
})

test('pre nested', t => {
  const result = convertFile('test/material/2/pre-nested.json')
  t.is(result, `// Auto-generated by the Load Impact converter

import "./postman-shim.js";
import { group } from "k6";

export let options = { maxRedirects: 4 };

const Pre = Symbol.for("pre");
const Request = Symbol.for("request");

export default function() {
  group("TestFolder", function() {
    postman[Pre].push(() => {
      pm.variables.set("test", "a");
    });

    group("TestFolder2", function() {
      postman[Pre].push(() => {
        pm.variables.set("test2", "b");
      });

      group("TestFolder3", function() {
        postman[Pre].push(() => {
          pm.variables.set("test3", "c");
        });

        postman[Request]({
          name: "TestRequest",
          method: "GET",
          address: "http://example.com"
        });

        postman[Pre].pop();
      });

      postman[Pre].pop();
    });

    postman[Pre].pop();
  });
}
`)
})

test('post request', t => {
  const result = convertFile('test/material/2/post-request.json')
  t.is(result, `// Auto-generated by the Load Impact converter

import "./postman-shim.js";

export let options = { maxRedirects: 4 };

const Request = Symbol.for("request");

export default function() {
  postman[Request]({
    name: "TestRequest",
    method: "GET",
    address: "http://example.com",
    post(response) {
      pm.variables.set("test", "a");
      pm.variables.set("test", "b");
      pm.variables.set("test", "c");
    }
  });
}
`)
})

test('post collection', t => {
  const result = convertFile('test/material/2/post-collection.json')
  t.is(result, `// Auto-generated by the Load Impact converter

import "./postman-shim.js";

export let options = { maxRedirects: 4 };

const Post = Symbol.for("post");
const Request = Symbol.for("request");

export default function() {
  postman[Post].push(() => {
    pm.variables.set("test", "a");
    pm.variables.set("test", "b");
    pm.variables.set("test", "c");
  });

  postman[Request]({
    name: "TestRequest",
    method: "GET",
    address: "http://example.com"
  });

  postman[Post].pop();
}
`)
})