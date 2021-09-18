const aid = require('../aid');
const ListMember = require('./ListMember');
const readPost = require('../common/post');
const readPre = require('../common/pre');
const { readAuth } = require('../common');

function ItemGroup(group, result, block) {
  result.imports.set('group', { base: 'k6' });
  const spec = aid.makeGroup({ name: group.name, auths: block.auths });
  scripts(group, result, spec);
  readAuth(group.auth, spec.auths);
  block.main.push(spec);
  const members = aid.spread(group.items);
  for (const member of members) {
    result.group = { name: group.name };
    ListMember(member, result, spec);
  }
}

function scripts(group, result, spec) {
  readPre(group, spec, result);
  if (spec.pre) {
    result.symbols.set('Pre', 'pre');
  }
  readPost(group, spec, result);
  if (spec.post) {
    result.symbols.set('Post', 'post');
  }
}

module.exports = ItemGroup;
