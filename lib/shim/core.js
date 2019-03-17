import http from 'k6/http'

/* Constants */
const undef = void 0

/* Symbols */
const Assign = Symbol('assign')
const Clear = Symbol('clear')
const Has = Symbol('has')
const Initial = Symbol.for('initial')
const Iteration = Symbol.for('iteration')
const Request = Symbol.for('request')
const Reset = Symbol.for('reset')
const Var = Symbol.for('variable')
const Write = Symbol('write')

/*
 * Functional manipulation of frozen dicts
 *
 * These objects are frozen for consistency with Postman readonly semantics.
 * The constructor property is forced clear to keep it as clean as possible.
 *
 * Ideally these objects would have no prototype but it seems impossible.
 * The following methods fail:
 *
 * - Object.create(null) - Throws a TypeError on access of created object:
 *   Could not convert &{Object 0xc420ba9980 <nil> true map[] []} to primitive
 * - Object.setPrototypeOf() - Not implemented.
 * - Reflect.setPrototypeOf() - Reports success but prototype persists.
 * - obj.__proto__ - Not available. Access returns undefined.
 * - Proxy intercepting property access - Proxies not implemented.
 */
class Dict {
  constructor (values = {}) {
    this.constructor = undef
    Object.assign(this, values)
    Object.freeze(this)
  }

  [Assign] (updates) {
    const values = Object.assign({}, this)
    Object.assign(values, updates)
    return new Dict(values)
  }

  [Clear] (key) {
    const values = Object.assign({}, this)
    delete values[key]
    return new Dict(values)
  }

  [Has] (key) {
    return (this[key] !== undef)
  }

  [Write] (key, value) {
    const values = Object.assign({}, this)
    values[key] = value
    return new Dict(values)
  }
}

/* State */
const state = {
  initialized: false,
  collection: false,
  environment: false,
  data: false,
  request: false,
  post: false
}
const scope = {
  global: new Dict(),
  collection: new Dict(),
  environment: new Dict(),
  data: new Dict(),
  local: new Dict()
}
const data = {
  file: []
}
const store = {
  request: {
    data: Object.freeze({}),
    headers: Object.freeze({}),
    name: null,
    method: null,
    url: null
  },
  response: {
    body: {
      text: null,
      json: null
    },
    code: null,
    time: null
  }
}
const setting = {
  iterations: 1
}
const surface = {
  pm: null
}
const standard = {
  require: global.require
}

/* State validation */
function requireEnvironment () {
  if (!state.environment) {
    throw new Error('Missing Postman environment')
  }
}
function requireRequest () {
  if (!state.request) {
    throw new Error('May only be used in a request scope')
  }
}

/* Dynamic variables */
const dynamic = {
  /* Version 4 GUID */
  guid () {
    // From https://stackoverflow.com/a/2117523/10086414
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      c => {
        const r = Math.random() * 16 | 0
        const v = (c === 'x' ? r : (r & 0x3 | 0x8))
        return v.toString(16)
      }
    )
  },

  /* Random integer [0,1000] */
  randomInt () {
    return Math.floor(Math.random() * 1001)
  },

  /* Current time as Unix timestamp */
  timestamp () {
    return Date.now()
  }
}
function computeDynamic (name) {
  if (dynamic[name]) {
    return dynamic[name]()
  } else {
    throw new Error(`Unsupported dynamic variable: ${name}`)
  }
}

/* postman.* */
const postman = Object.freeze({
  clearEnvironmentVariable (name) {
    requireEnvironment()
    pm.environment.unset(name)
  },
  clearEnvironmentVariables () {
    requireEnvironment()
    pm.environment.clear()
  },
  clearGlobalVariable (name) {
    pm.globals.unset(name)
  },
  clearGlobalVariables () {
    pm.globals.clear()
  },
  getEnvironmentVariable (name) {
    requireEnvironment()
    return pm.environment.get(name)
  },
  getGlobalVariable (name) {
    return pm.globals.get(name)
  },
  setEnvironmentVariable (name, value) {
    requireEnvironment()
    pm.environment.set(name, value)
  },
  setGlobalVariable (name, value) {
    pm.globals.set(name, value)
  },

  /*
   * Reset shim
   *
   * Clears to preinitialized state. For use in tests.
   */
  [Reset] () {
    state.initialized = false
    state.collection = false
    state.environment = false
    state.data = false
    state.scope = false
    state.post = false
    scope.global = new Dict()
    scope.collection = new Dict()
    scope.environment = new Dict()
    scope.data = new Dict()
    scope.local = new Dict()
    exposePm()
  },

  /*
   * Initialize shim
   *
   * Only necessary if setting some initial values. May only be called once.
   * Must be called before calling other methods. Shim behavior is undefined
   * if called after other methods.
   */
  [Initial] (initial = {}) {
    if (state.initialized) {
      throw new Error('Scope already initialized')
    }
    state.initialized = true
    if ('global' in initial) {
      scope.global = scope.global[Assign](initial.global)
    }
    if ('collection' in initial) {
      state.collection = true
      scope.collection = scope.collection[Assign](initial.collection)
    }
    if ('environment' in initial) {
      state.environment = true
      scope.environment = scope.environment[Assign](initial.environment)
    }
    if ('data' in initial) {
      state.data = true
      data.file = [ ...initial.data ].reverse()
      setting.iterations = data.file.length
    }
    if ('iterations' in initial) {
      setting.iterations = initial.iterations
    }
    exposePm()
  },

  /*
   * Initialize test iteration
   *
   * Advances to next row of data variables. Stays on final row after end.
   */
  [Iteration] () {
    if (data.file.length) {
      const row = data.file.pop()
      scope.data = new Dict(row)
    }
  },

  /**
   * Execute request with Postman semantics
   *
   * Executes a request and surrounding logic with a scoped set of local
   * variables. Exposes request specific API surface during execution. Exposes
   * test script specific API surface during test script execution. Executes
   * provided logic synchronously.
   *
   * @param {string} name - Request name.
   * @param {string} method - Request method.
   * @param {string} address - Request address.
   * @param {string|object} [data] - Data for request body.
   * @param {object} [headers] - Request headers.
   * @param {object} [options] - k6 request options, except headers.
   * @param {function} [pre] - Prerequest logic.
   * @param {function} [auth] - Authentication logic.
   * @param {function} [post] - Postrequest logic. Receives k6 response.
   * @return k6 response.
   */
  [Request] ({
    name, method, address, data, headers, options, pre, auth, post
  }) {
    try {
      enterRequest(name, method, address, data, headers)
      if (pre) {
        pre()
      }
      const config = makeRequestConfig(method, address, data, headers, options)
      if (auth) {
        auth(config, Var)
      }
      const args = makeRequestArgs(config)
      const response = http.request(...args)
      if (post) {
        enterTest(response)
        post(response)
      }
      return response
    } finally {
      exitRequest()
    }
  }
})
function makeRequestConfig (method, address, data, headers, options) {
  const config = {}
  config.method = method || null
  config.address = address ? evaluate(address) : null
  if (typeof data === 'string') {
    config.data = data
  } else if (data && typeof data === 'object') {
    for (const key of Object.keys(data)) {
      data[key] = evaluate(data[key])
    }
    config.data = data
  } else {
    config.data = null
  }
  if (headers) {
    for (const key of Object.keys(headers)) {
      headers[key] = evaluate(headers[key])
    }
    config.headers = headers
  } else {
    config.headers = {}
  }
  config.options = options || {}
  return config
}
function makeRequestArgs ({ method, address, data, headers, options }) {
  options.headers = headers
  return [ method, address, data, options ]
}

/* pm.* */
const pm = Object.freeze({
  /* Environment variables */
  environment: Object.freeze({
    clear () {
      scope.environment = new Dict()
    },
    get (name) {
      return scope.environment[name]
    },
    has (name) {
      return scope.environment[Has](name)
    },
    set (name, value) {
      scope.environment = scope.environment[Write](name, value)
    },
    toObject () {
      return Object.assign({}, scope.environment)
    },
    unset (name) {
      scope.environment = scope.environment[Clear](name)
    }
  }),

  /* Global variables */
  globals: Object.freeze({
    clear () {
      scope.global = new Dict()
    },
    get (name) {
      return scope.global[name]
    },
    has (name) {
      return scope.global[Has](name)
    },
    set (name, value) {
      scope.global = scope.global[Write](name, value)
    },
    toObject () {
      return Object.assign({}, scope.global)
    },
    unset (name) {
      scope.global = scope.global[Clear](name)
    }
  }),

  /* Runtime information */
  info: Object.freeze({
    get eventName () {
      if (state.post) {
        return 'test'
      } else {
        return 'prerequest'
      }
    },
    get iteration () {
      return global.__ITER
    },
    get iterationCount () {
      return setting.iterations
    },
    get requestId () {
      return request.id
    },
    get requestName () {
      return request.name
    }
  }),

  /* Data variables */
  iterationData: Object.freeze({
    get (name) {
      return scope.data[name]
    },
    toObject () {
      return Object.assign({}, scope.data)
    }
  }),

  /* Request information */
  request: Object.freeze({
    get headers () {
      throw new Error('pm.request.headers not supported')
    },
    get url () {
      throw new Error('pm.request.url not supported')
    }
  }),

  /* Response information */
  response: Object.freeze({
    get code () {
      return store.response.code
    },
    get headers () {
      throw new Error('pm.response.headers not supported')
    },
    json () {
      if (store.response.body.text === null) {
        return null
      } else if (store.response.body.json === null) {
        store.response.body.json = JSON.parse(store.response.body.text)
        return store.response.body.json
      } else {
        return store.response.body.json
      }
    },
    reason () {
      throw new Error('pm.response.reason: Response reason unavailable in k6')
    },
    get responseTime () {
      return store.response.time
    },
    text () {
      return store.response.body.text
    }
  }),

  /* General variable access */
  variables: Object.freeze({
    get (name) {
      return (
        (scope.local[Has](name) && scope.local[name]) ||
        (scope.data[Has](name) && scope.data[name]) ||
        (scope.environment[Has](name) && scope.environment[name]) ||
        (scope.collection[Has](name) && scope.collection[name]) ||
        (scope.global[Has](name) && scope.global[name]) ||
        undef
      )
    },
    set (name, value) {
      requireRequest()
      scope.local = scope.local[Write](name, value)
    }
  }),

  /**
   * Evaluate variable
   *
   * For use in string interpolation. Computes dynamic variables.
   * Reads simple variables from full scope hierarchy.
   *
   * @example
   * const Var = Symbol.for('variable')
   * const address = `${pm[Var]('protocol')}://${pm[Var]('domain')}/index.html`
   */
  [Var] (name) {
    if (name[0] === '$') {
      return computeDynamic(name.substring(1))
    } else {
      return this.variables.get(name)
    }
  }
})
function exposePm () {
  const exposed = {
    environment: pm.environment,
    globals: pm.globals,
    info: pm.info,
    request: pm.request,
    variables: pm.variables,
    [Var]: pm[Var]
  }
  if (state.data) {
    exposed.iterationData = pm.iterationData
  }
  if (state.post) {
    exposed.response = pm.response
  }
  Object.freeze(exposed)
  surface.pm = exposed
}

/* request */
const request = Object.freeze({
  get data () {
    return store.request.data
  },
  get headers () {
    return store.request.headers
  },
  get id () {
    throw new Error('Postman request IDs not included in the Postman export')
  },
  get method () {
    return store.request.method
  },
  get name () {
    return store.request.name
  },
  get url () {
    return store.request.url
  }
})

/* responseCode */
const responseCode = Object.freeze({
  get code () {
    return store.response.code
  },
  get detail () {
    throw new Error('responseCode.detail: Response message unavailable in k6')
  },
  get name () {
    throw new Error('responseCode.name: Response message unavailable in k6')
  }
})

/* Conversion */
function xml2Json (xml) {
  throw new Error('To use xml2Json import shim/xml2Json.js')
}
function xmlToJson (xml) {
  throw new Error('Deprecated function xmlToJson not supported')
}

/* Standard library */
function require (id) {
  throw new Error(
    `Can't load module '${id}', Node.js modules aren't supported in k6`
  )
}

/* Template strings */
const variables = /{{(.*?)}}/g
function evaluate (string) {
  return string.replace(variables, (match, name) => pm[Var](name))
}

/* Scoped interface */
function enterRequest (name, method, address, data, headers) {
  state.request = true
  if (name) {
    store.request.name = name
  }
  if (method) {
    store.request.method = method.toUpperCase()
  }
  if (address) {
    store.request.url = address
  }
  if (data && typeof data === 'object') {
    store.request.data = Object.freeze(Object.assign({}, data))
  }
  if (headers) {
    store.request.headers = Object.freeze(Object.assign({}, headers))
  }
  Object.assign(global, {
    require
  })
}
function enterTest (response = {}) {
  state.post = true
  Object.assign(store.response, {
    code: response.status,
    time: response.timings ? response.timings.duration : undef
  })
  if (typeof response.body === 'string') {
    store.response.body.text = response.body
  }
  exposePm()
}
function exitRequest () {
  state.request = false
  state.post = false
  scope.local = new Dict()
  store.request = {
    data: Object.freeze({}),
    headers: Object.freeze({}),
    method: null,
    name: null,
    url: null
  }
  store.response = {
    body: {
      text: null,
      json: null
    },
    code: null,
    time: null
  }
  exposePm()
  Object.assign(global, {
    require: standard.require
  })
}

/* Interface */
Object.defineProperties(global, {
  data: {
    get () {
      return (state.data ? scope.data : undef)
    }
  },
  environment: {
    get () {
      return scope.environment
    }
  },
  globals: {
    get () {
      return scope.global
    }
  },
  iteration: {
    get () {
      return pm.info.iteration
    }
  },
  pm: {
    get () {
      return surface.pm
    }
  },
  request: {
    get () {
      return (state.request ? request : undef)
    }
  },
  responseBody: {
    get () {
      return (state.post ? store.response.body.text : undef)
    }
  },
  responseCode: {
    get () {
      return (state.post ? responseCode : undef)
    }
  },
  responseTime: {
    get () {
      return (state.post ? store.response.time : undef)
    }
  }
})
Object.assign(global, {
  postman,
  xml2Json,
  xmlToJson
})
exposePm()
