function HandleSummary(k6HandleSummaryOptions, result) {
  result.handleSummary = [];
  if (k6HandleSummaryOptions.json) {
    injectJsonHandleSummary(k6HandleSummaryOptions.json, result);
  }
  if (k6HandleSummaryOptions.junit) {
    injectJunitHandleSummary(k6HandleSummaryOptions.junit, result);
  }
}

function injectJsonHandleSummary(jsonPath, result) {
  const jsonOut = `"${jsonPath}": JSON.stringify(data)`;
  result.handleSummary.push(jsonOut);
}

function injectJunitHandleSummary(junitPath, result) {
  result.imports.set('jUnit', { base: './libs/shim/handleSummary.js' });
  const junitOut = `"${junitPath}": jUnit(data)`;
  result.handleSummary.push(junitOut);
}

module.exports = HandleSummary;
