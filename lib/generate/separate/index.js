const aggregate = require('./aggregate');
const map = require('./map');
const render = require('./render');

function separate(node, result) {
  const aggregated = aggregate(node);
  const mapped = map(aggregated);
  result.requests = render(mapped, result);
}

module.exports = separate;
