function header (request) {
  const token = request.auth.bearer.get('token')
  return { key: 'Authorization', value: `Bearer ${token}` }
}

Object.assign(exports, {
  enabled: true,
  header
})
