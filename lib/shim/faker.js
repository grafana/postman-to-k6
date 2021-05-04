/* global postman */

import faker from '../faker.js';

const Extend = Symbol.for('extend');

postman[Extend].module.faker = faker;
