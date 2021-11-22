const designate = require('./designate');
const { Auth } = require('../sym');

function map(aggregated) {
  const tree = {};
  if (aggregated.auth) {
    tree[Auth] = aggregated.auth;
  }
  content(aggregated, tree);
  return tree;
}

function content(spec, container) {
  const generators = {};
  items(spec.items, container, generators, spec.group);
  locations(spec.locations, container, generators);
}

function items(list, container, generators, group) {
  for (const spec of list) {
    item(spec, container, generators, group);
  }
}

function item(spec, container, generators, group) {
  const designation = designate(spec.name, container, generators, '.js');
  if (group) {
    spec.group = group;
  }
  container[designation] = spec;
}

function locations(list, container, generators) {
  for (const spec of list) {
    location(spec, container, generators);
  }
}

function location(spec, container, generators) {
  const node = {};
  if (spec.auth) {
    node[Auth] = spec.auth;
  }
  content(spec, node);
  const designation = designate(spec.name, container, generators);
  container[designation] = node;
}

module.exports = map;
