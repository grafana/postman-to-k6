import test from 'ava'
import convertFile from 'convert/file'

test('minimal', t => {
  const result = convertFile('test/material/2/minimal.json')
  t.is(result, `// No HTTP/HTTPS transactions have been recorded.`)
})
