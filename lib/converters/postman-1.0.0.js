
var Collection = require('postman-collection').Collection,
    transformer = require('postman-collection-transformer'),
    LuaGenerator = require('../postman/lua-generator');

module.exports = {

  convert: function(content, callback) {

    var options = {
      inputVersion: '1.0.0',
      outputVersion: '2.0.0'
    };

    transformer.convert(content, options, function (error, convertedContent) {

      if (error) {
        callback(error);
        return;
      }

      try {
        var collection = new Collection(convertedContent);
        var result = LuaGenerator.convert(collection)
        callback(null, result);
      } catch(error) {
        callback(error);
      }

    });

  }

}
