const undef = void 0

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

  assign (updates) {
    const values = Object.assign({}, this)
    Object.assign(values, updates)
    return new Dict(values)
  }

  set (key, value) {
    const values = Object.assign({}, this)
    values[key] = value
    return new Dict(values)
  }

  unset (key) {
    const values = Object.assign({}, this)
    delete values[key]
    return new Dict(values)
  }
}

const state = {
  initialized: false,
  collection: false,
  environment: false,
  data: false
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

function requireEnvironment () {
  if (!state.environment) {
    throw new Error('Missing Postman environment')
  }
}

const postman = Object.freeze({
  clearEnvironmentVariable (name) {
    requireEnvironment()
    scope.environment = scope.environment.unset(name)
    global.environment = scope.environment
  },

  clearGlobalVariable (name) {
    scope.global = scope.global.unset(name)
    global.globals = scope.global
  },

  clearEnvironmentVariables () {
    requireEnvironment()
    scope.environment = new Dict()
    global.environment = scope.environment
  },

  clearGlobalVariables () {
    scope.global = new Dict()
    global.globals = scope.global
  },

  getEnvironmentVariable (name) {
    requireEnvironment()
    return scope.environment[name]
  },

  getGlobalVariable (name) {
    return scope.global[name]
  },

  setEnvironmentVariable (name, value) {
    requireEnvironment()
    scope.environment = scope.environment.set(name, value)
    global.environment = scope.environment
  },

  setGlobalVariable (name, value) {
    scope.global = scope.global.set(name, value)
    global.globals = scope.global
  },

  /*
   * Reset shim
   *
   * Clears to preinitialized state. For use in tests.
   */
  [Symbol.for('reset')] () {
    state.initialized = false
    state.collection = false
    state.environment = false
    state.data = false
    scope.global = new Dict()
    scope.collection = new Dict()
    scope.environment = new Dict()
    scope.data = new Dict()
    scope.local = new Dict()
    global.globals = scope.global
    global.environment = scope.environment
    delete global.data
  },

  /*
   * Initialize shim
   *
   * May only be called once. Must be called before using other methods.
   * Shim behavior undefined if called after using other methods.
   */
  [Symbol.for('initial')] (initial = {}) {
    if (state.initialized) {
      throw new Error('Scope already initialized')
    }
    state.initialized = true
    if ('global' in initial) {
      scope.global = scope.global.assign(initial.global)
      global.globals = scope.global
    }
    if ('collection' in initial) {
      state.collection = true
      scope.collection = scope.collection.assign(initial.collection)
    }
    if ('environment' in initial) {
      state.environment = true
      scope.environment = scope.environment.assign(initial.environment)
      global.environment = scope.environment
    }
    if ('data' in initial) {
      state.data = true
      data.file = [ ...initial.data ].reverse()
      global.data = scope.data
    }
  },

  /**
   * Initialize test iteration
   *
   * Advances to next row of data variables. Stays on final row after end.
   */
  [Symbol.for('iteration')] () {
    if (data.file.length) {
      const row = data.file.pop()
      scope.data = new Dict(row)
      global.data = scope.data
    }
  }
})

/* Dynamic variable routines */
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

const pm = Object.freeze({
  globals: Object.freeze({

  }),

  variables: Object.freeze({
    get (name) {
      return (
        (name in scope.local && scope.local[name]) ||
        (name in scope.data && scope.data[name]) ||
        (name in scope.environment && scope.environment[name]) ||
        (name in scope.collection && scope.collection[name]) ||
        scope.global[name]
      )
    }
  }),

  /*
   * Evaluate variable
   *
   * For use in string interpolation. Computes dynamic variables.
   * Reads simple variables from full scope hierarchy.
   *
   * @example
   * const Var = Symbol.for('variable')
   * const address = `${pm[Var]('protocol')}://${pm[Var]('domain')}/index.html`
   */
  [Symbol.for('variable')] (name) {
    if (name[0] === '$') {
      return computeDynamic(name.substring(1))
    } else {
      return this.variables.get(name)
    }
  }
})

Object.assign(global, {
  environment: scope.environment,
  globals: scope.global,
  pm,
  postman
})
