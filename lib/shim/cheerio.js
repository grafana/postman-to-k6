/* global postman */

import { cheerio } from '../compat.js'

const Extend = Symbol.for('extend')

postman[Extend].module.cheerio = cheerio
