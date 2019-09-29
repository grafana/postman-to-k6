/* global postman */

import { urijs as URI } from '../compat.js'

const Extend = Symbol.for('extend')

postman[Extend].module.urijs = URI
