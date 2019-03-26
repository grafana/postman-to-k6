import fs from 'fs'

const configJson = fs.readFileSync('.ava.json')
const config = JSON.parse(configJson)

export default config
