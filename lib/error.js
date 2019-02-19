const { VError } = require('verror')

class PostmanToK6Error extends VError {}
class ParseError extends PostmanToK6Error {}
class ReadError extends PostmanToK6Error {}

module.exports = {
  PostmanToK6Error,
  ParseError,
  ReadError
}
