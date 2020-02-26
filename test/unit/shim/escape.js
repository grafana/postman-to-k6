import test from 'ava'
import { esc } from '../../../lib/shim/escape'

test('should encode an url', t => {
  const input = '#!()'
  const expectation = '%23%21%28%29'

  t.is(esc(input), expectation)
})

test('should not encode safe chars', t => {
  const input = 'abc123@'
  const escapedValue = esc(input)

  t.is(escapedValue, input)
})
