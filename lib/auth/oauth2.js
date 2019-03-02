const util = require('../util')

const Location = Object.freeze({
  Address: 0,
  Body: 1,
  Header: 2
})

class Oauth2Auth {
  constructor (settings, feature) {
    const params = settings.parameters()
    const location = getLocation(params)
    const token = params.get('accessToken')
    switch (location) {
      case Location.Header: {
        const value = util.evalString(`Bearer ${token}`)
        this.headers = new Map().set('Authorization', { raw: true, value })
        break
      }
      case Location.Address: {
        this.imports = new Map().set('URI', './urijs.js')
        this.declares = new Set().add('address')
        this.pre = []
        const address = util.evalString(feature.address.toString())
        this.address = `address.toString()`
        this.pre.push(`address = new URI(${address})`)
        const evalToken = util.evalString(token)
        this.pre.push(`address.addQuery("access_token", ${evalToken})`)
        break
      }
    }
  }
}

function getLocation (params) {
  const label = params.get('addTokenTo')
  switch (label) {
    case 'header':
      return Location.Header
    case 'queryParams':
      return Location.Address
    default:
      throw new Error(`Unrecognized auth data location: ${label}`)
  }
}

module.exports = Oauth2Auth
