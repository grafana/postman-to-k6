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
const dict = {
  assign (obj, values) {
    const result = {}
    result.constructor = undef
    Object.assign(result, obj)
    Object.assign(result, values)
    Object.freeze(result)
    return result
  },

  clear (obj, key) {
    const result = {}
    result.constructor = undef
    Object.assign(result, obj)
    delete result[key]
    Object.freeze(result)
    return result
  },

  make () {
    const obj = {}
    obj.constructor = undef
    Object.freeze(obj)
    return obj
  },

  set (obj, key, value) {
    const result = {}
    result.constructor = undef
    Object.assign(result, obj)
    result[key] = value
    Object.freeze(result)
    return result
  }
}

const state = {
  initialized: false,
  collection: false,
  environment: false,
  data: false
}

const scope = {
  global: dict.make(),
  collection: dict.make(),
  environment: dict.make(),
  data: dict.make(),
  local: dict.make()
}

function requireEnvironment () {
  if (!state.environment) {
    throw new Error('Missing Postman environment')
  }
}

const postman = Object.freeze({
  clearEnvironmentVariable (name) {
    requireEnvironment()
    scope.environment = dict.clear(scope.environment, name)
    global.environment = scope.environment
  },

  clearGlobalVariable (name) {
    scope.global = dict.clear(scope.global, name)
    global.globals = scope.global
  },

  clearEnvironmentVariables () {
    requireEnvironment()
    scope.environment = dict.make()
    global.environment = scope.environment
  },

  clearGlobalVariables () {
    scope.global = dict.make()
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
    scope.environment = dict.set(scope.environment, name, value)
    global.environment = scope.environment
  },

  setGlobalVariable (name, value) {
    scope.global = dict.set(scope.global, name, value)
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
    scope.global = dict.make()
    scope.collection = dict.make()
    scope.environment = dict.make()
    scope.data = dict.make()
    scope.local = dict.make()
  },

  /*
   * Initialize scope
   *
   * May only be called once. Must be called before using other methods.
   * Shim behavior undefined if called after using other methods.
   */
  [Symbol.for('scope')] (initial = {}) {
    if (state.initialized) {
      throw new Error('Scope already initialized')
    }
    state.initialized = true
    if ('global' in initial) {
      scope.global = dict.assign(scope.global, initial.global)
      global.globals = scope.global
    }
    if ('collection' in initial) {
      state.collection = true
      scope.collection = dict.assign(scope.collection, initial.collection)
    }
    if ('environment' in initial) {
      state.environment = true
      scope.environment = dict.assign(scope.environment, initial.environment)
      global.environment = scope.environment
    }
    if ('data' in initial) {
      state.data = true
      scope.data = dict.assign(scope.data, initial.data)
    }
  }
})

const pm = Object.freeze({
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
  })
})

Object.assign(global, {
  environment: scope.environment,
  globals: scope.global,
  pm,
  postman
})
