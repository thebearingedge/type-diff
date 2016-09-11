import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { types, Optional, Nullable, Any } from './types'

const { keys, assign } = Object

export default function diff(Type, obj, options = {}) {

  if (Type === Any || Type instanceof Any) return null

  const { strict } = assign({}, { strict: true }, options)

  if (Type instanceof Optional) {
    if (isUndefined(obj)) return null
    return diff(Type.Type, obj, { strict })
  }

  if (Type instanceof Nullable) {
    if (isNull(obj)) return null
    return diff(Type.Type, obj, { strict })
  }

  if (isArray(Type)) {

    if (!isArray(obj)) {
      return {
        actual: getTypeName(obj),
        expected: 'Array',
        value: obj
      }
    }

    let result = null

    for (let i = 0, len = obj.length; i < len; i++) {
      const incorrect = diff(Type[0], obj[i], { strict })
      if (incorrect) {
        result = result || {}
        result[i] = incorrect
      }
    }

    return result
  }

  if (isPlainObject(Type)) {

    const typeKeys = keys(Type)
    let unexpected = null
    let incorrect = null

    if (strict) {
      const objKeys = keys(obj)
      const extraKeys = difference(objKeys, typeKeys)
      if (extraKeys.length) {
        unexpected = {}
        extraKeys.reduce((extra, key) => assign(extra, {
          [key]: {
            unexpected: getTypeName(obj[key]),
            value: obj[key]
          }
        }), unexpected)
      }
    }

    for (let i = 0, len = typeKeys.length; i < len; i++) {
      const key = typeKeys[i]
      const result = diff(Type[key], obj[key], { strict })
      if (result) {
        incorrect = incorrect || {}
        assign(incorrect, { [key]: result })
      }
    }

    return unexpected || incorrect
      ? assign(unexpected || {}, incorrect || {})
      : null
  }

  const isOfType = types.get(Type) || (obj => obj.constructor === Type)

  if (!isOfType(obj)) {
    return {
      actual: getTypeName(obj),
      expected: Type.name,
      value: obj
    }
  }

  return null
}

const getTypeName = obj =>
  isNull(obj)
    ? 'Null'
    : isUndefined(obj)
      ? 'Undefined'
      : obj.constructor.name
