import sinon from 'sinon'

const Reset = Symbol.for('reset')

const http = {
  request: sinon.stub(),
  [Reset] () {
    this.request.reset()
  }
}

module.exports = http
