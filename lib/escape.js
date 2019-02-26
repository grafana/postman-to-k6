function bodyData (raw) {
  return requestContent(raw)
}

function requestContent (raw) {
  if (!raw) {
    return raw
  }
  return raw
    .replace(/"/g, '\\"')
    //  This replace fixes content which contains a doublequote string
    //  \"  - (first replace) -> \\" - (second replace to work in Lua) -> \\\"
    .replace(/\\\\"/g, '\\\\\\"')
    .replace(/[\r\n]/g, '')
}

Object.assign(exports, {
  bodyData
})
