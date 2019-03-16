import sinon from 'sinon'

const Reset = Symbol.for('reset')

const http = {
  request: sinon.stub(),
  [Reset] () {
    http.request.reset()
  }
}

module.exports = http
