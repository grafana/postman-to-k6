const undef = void 0

const Assign = Symbol('assign')
const Clear = Symbol('clear')
const Has = Symbol('has')
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
      scope.global = scope.global[Assign](initial.global)
      global.globals = scope.global
    }
    if ('collection' in initial) {
      state.collection = true
      scope.collection = scope.collection[Assign](initial.collection)
    }
    if ('environment' in initial) {
      state.environment = true
      scope.environment = scope.environment[Assign](initial.environment)
      global.environment = scope.environment
    }
    if ('data' in initial) {
      state.data = true
      data.file = [ ...initial.data ].reverse()
      global.data = scope.data
    }
    exposePm()
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
  /* Environment variables */
  environment: Object.freeze({
    clear () {
      scope.environment = new Dict()
      global.environment = scope.environment
    },
    get (name) {
      return scope.environment[name]
    },
    has (name) {
      return scope.environment[Has](name)
    },
    set (name, value) {
      scope.environment = scope.environment[Write](name, value)
      global.environment = scope.environment
    },
    toObject () {
      return Object.assign({}, scope.environment)
    },
    unset (name) {
      scope.environment = scope.environment[Clear](name)
      global.environment = scope.environment
    }
  }),

  /* Global variables */
  globals: Object.freeze({
    clear () {
      scope.global = new Dict()
      global.globals = scope.global
    },
    get (name) {
      return scope.global[name]
    },
    has (name) {
      return scope.global[Has](name)
    },
    set (name, value) {
      scope.global = scope.global[Write](name, value)
      global.globals = scope.global
    },
    toObject () {
      return Object.assign({}, scope.global)
    },
    unset (name) {
      scope.global = scope.global[Clear](name)
      global.globals = scope.global
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

  /* General variable access */
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
    variables: pm.variables,
    [Var]: pm[Var]
  }
  if (state.data) {
    exposed.iterationData = pm.iterationData
  }
  Object.freeze(exposed)
  global.pm = exposed
}

Object.assign(global, {
  environment: scope.environment,
  globals: scope.global,
  postman
})
exposePm()
