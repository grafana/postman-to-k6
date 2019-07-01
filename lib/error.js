const { VError } = require('verror')

class PostmanToK6Error extends VError {}
class InvalidError extends PostmanToK6Error {}
class ParseError extends PostmanToK6Error {}
class ReadError extends PostmanToK6Error {}

module.exports = {
  PostmanToK6Error,
  InvalidError,
  ParseError,
  ReadError
}
