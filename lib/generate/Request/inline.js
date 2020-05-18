const analyze = require('./analyze');
const id = require('./id');
const renderConfig = require('./config');

function inline (name, request, result, block) {
  const feature = analyze(request, result, block);
  const config = renderConfig(name, id(result), feature);
  block.main.push(`postman[Request](${config})`);
}

module.exports = inline;
