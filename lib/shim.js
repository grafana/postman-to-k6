/* global globals environment */

const undef = void 0

const state = {
  environment: false,
  scope: false
}

function requireEnvironment () {
  if (!state.environment) {
    throw new Error('Missing Postman environment')
  }
}

const postman = Object.freeze({
  clearEnvironmentVariable (name) {
    requireEnvironment()
    global.environment = dict.clear(environment, name)
  },

  clearGlobalVariable (name) {
    global.globals = dict.clear(globals, name)
  },

  clearEnvironmentVariables () {
    requireEnvironment()
    global.environment = dict.make()
  },

  clearGlobalVariables () {
    global.globals = dict.make()
  },

  getEnvironmentVariable (name) {
    requireEnvironment()
    return environment[name]
  },

  getGlobalVariable (name) {
    return globals[name]
  },

  setEnvironmentVariable (name, value) {
    requireEnvironment()
    global.environment = dict.set(environment, name, value)
  },

  setGlobalVariable (name, value) {
    global.globals = dict.set(globals, name, value)
  },

  /*
   * Reset shim
   *
   * Clears to preinitialized state. For use in tests.
   */
  [Symbol.for('reset')] () {
    global.globals = dict.make()
    if (state.environment) {
      global.environment = dict.make()
      state.environment = false
    }
    state.scope = false
  },

  /*
   * Initialize scope
   *
   * May only be called once. Must be called before using other methods.
   * Shim behavior undefined if called after using other methods.
   */
  [Symbol.for('scope')] () {
    const { globals = {} } = arguments[0] || {}

    if (state.scope) {
      throw new Error('Scope already initialized')
    }
    global.globals = dict.assign(global.globals, globals)
  }
})

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

Object.assign(global, {
  globals: dict.make(),
  postman
})
