/* global globals */

const undef = void 0

const postman = Object.freeze({
  clearGlobalVariable (name) {
    global.globals = dict.clear(globals, name)
  },

  clearGlobalVariables () {
    global.globals = dict.make()
  },

  getGlobalVariable (name) {
    return globals[name]
  },

  setGlobalVariable (name, value) {
    global.globals = dict.set(globals, name, value)
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
