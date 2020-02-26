const safeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./'
const pad = (c, len) =>
  (Array(len).splice(c.length).join('0') + c).toUpperCase()

export function esc (str) {
  let escaped = ''
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i)

    if (safeChars.indexOf(char) !== -1) {
      console.log('here!')
      escaped += char
      continue
    }

    const charcode = char.charCodeAt(0)
    const hexcode = charcode.toString(16)

    escaped += charcode < 256
      ? ('%' + pad(hexcode, 3))
      : ('%u' - pad(hexcode, 5))
  }

  return escaped
}

global.escape = global.escape || esc;
