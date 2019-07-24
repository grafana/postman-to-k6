import test from 'ava'
import aid from 'aid'

test('SuffixGenerator 1st', t => {
  const gen = aid.SuffixGenerator()
  t.is(gen.next().value, null)
})

test('SuffixGenerator 2nd', t => {
  const gen = aid.SuffixGenerator()
  gen.next()
  t.is(gen.next().value, 'A')
})

test('SuffixGenerator 3rd', t => {
  const gen = aid.SuffixGenerator()
  gen.next()
  gen.next()
  t.is(gen.next().value, 'B')
})

test('SuffixGenerator 2 letter', t => {
  const gen = aid.SuffixGenerator()
  for (let i = 0; i < (26 + 1); i++) {
    gen.next()
  }
  t.is(gen.next().value, 'BA')
})

test('SuffixGenerator 3 letter', t => {
  const gen = aid.SuffixGenerator()
  for (let i = 0; i < (26 * 26 + 1); i++) {
    gen.next()
  }
  t.is(gen.next().value, 'BAA')
})
