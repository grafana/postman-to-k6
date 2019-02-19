function header (request) {
  const params = request.auth.basic
  if (!params) return
  const credentialString = `${params.username}:${params.password}`
  const credentialBinary = Buffer.from(credentialString, 'utf8')
  const credential = credentialBinary.toString('base64')
  return `{ "Authorization": "Basic ${credential}" }`
}

Object.assign(exports, {
  enabled: true,
  header
})
