var util = require('util');

// see https://docs.k6.io/docs/k6http
var SUPPORTED_METHODS = {
    "get": "get",
    "head": "head",
    "post": "post",
    "put": "put",
    "patch": "patch",
    "delete": "del",
    "batch": "batch"
};

module.exports = {

  buildK6Request: function(options) {

    var url = options.url,
        method = options.method,
        headers = options.headers,
        data = options.data,
        preRequest = options.preRequest,
        postRequest = options.postRequest,
        variable = options.variable,
        variables = [],
        tmpVariables,
        result = '';

    if (preRequest) {
      result += util.format("    %s", preRequest);
    }

    if (variable) {
      result += util.format("    %s = ", variable);
    }

    tmpVariables = getVariables(url);
    if (tmpVariables) {
      variables = variables.concat(tmpVariables);
    }
    url = replaceCurlyBrackets(url);

    // handle not standard http method
    if(SUPPORTED_METHODS[method.toLowerCase()]) {
      result += util.format("http.%s(\"%s\"", SUPPORTED_METHODS[method.toLowerCase()], completeUrlWithScheme(url));
    }
    else {
      result += util.format("http.request(\"%s\",\"%s\"", method.toLowerCase(), completeUrlWithScheme(url));
    }

    // request data
    if (data) {
      result += util.format(",\n      \"%s\"", data);
    }
    else if (headers.length && data == null && method.toLowerCase() != "get") {
      result += ",\n      null";
    }

    // request headers
    if (headers.length) {

      headers = headers.join(', ');

      tmpVariables = getVariables(headers);
      if (tmpVariables) {
        variables = variables.concat(tmpVariables);
      }
      headers = replaceCurlyBrackets(headers);
      result += util.format(",\n      { headers: { %s } }", headers);
    }

    result += ");\n";

    if (postRequest) {
      result += util.format("%s", postRequest);
    }

    return {
      result: result,
      variables: variables
    };

  },

  escapeContent: function(input) {
    if (input) {

      //copied from loadimpact-chrome-extension

      // " --> \" (escape doublequote)
      input = input.replace(/"/g, '\\\"');

      //  This replace fixes content which contains a doublequote string
      //  \"  - (first replace) -> \\" - (second replace to work in Lua) -> \\\"
      input = input.replace(/\\\\"/g, '\\\\\\\"');
      input = input.replace(/[\r\n]/g, "");
    }
    return input;

  }



};

function getVariables(input) {


  if (input) {
    var matches = input.match(/{{(.*?)}}/g);
    if (matches) {
      return matches.map(function(item) {
        return item.replace(/{{/g,"").replace(/}}/g,"");
      });
    }
  }

}

function replaceCurlyBrackets(input) {

  return input.replace(/{{/g,"\"+").replace(/}}/g,"+\"");

}

// Complete a schemeless url
function completeUrlWithScheme(url) {
  if(url.match("^http(s?)://")) {
    return url;
  }
  else if(url.match("^//")) {
    return "http:"+url;
  }
  return "http://"+url;
}
