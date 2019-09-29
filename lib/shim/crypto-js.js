/* global postman */

import { cryptoJs } from '../compat.js'

const Extend = Symbol.for('extend')

postman[Extend].module['crypto-js'] = cryptoJs
