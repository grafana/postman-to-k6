function escapeContent (input) {
  if (input) {
    // copied from loadimpact-chrome-extension

    // " --> \" (escape doublequote)
    input = input.replace(/"/g, '\\"')

    //  This replace fixes content which contains a doublequote string
    //  \"  - (first replace) -> \\" - (second replace to work in Lua) -> \\\"
    input = input.replace(/\\\\"/g, '\\\\\\"')
    input = input.replace(/[\r\n]/g, '')
  }
  return input
}

Object.assign(exports, {
  escapeContent
})
