/* global postman */

import compat from '../compat.js'

const Extend = Symbol.for('extend')

postman[Extend].module['crypto-js'] = compat['crypto-js']
