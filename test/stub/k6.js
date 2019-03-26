import sinon from 'sinon'

const Reset = Symbol.for('reset')

const k6 = {
  check: sinon.stub(),
  [Reset] () {
    this.check.reset()
  }
}

module.exports = k6
