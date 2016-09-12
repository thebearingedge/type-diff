import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { types, Optional, Nullable, Any } from './types'

const { keys, assign } = Object
const is = (Type, value) => value instanceof Type

export default function diff(Type, obj, { subset=false, instanceOf=is } = {}) {

  if (Type === Any || Type instanceof Any) return null

  if (Type instanceof Optional) {
    if (isUndefined(obj)) return null
    return diff(Type.Type, obj, { subset, instanceOf })
  }

  if (Type instanceof Nullable) {
    if (isNull(obj)) return null
    return diff(Type.Type, obj, { subset, instanceOf })
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
      const incorrect = diff(Type[0], obj[i], { subset, instanceOf })
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

    if (!subset) {
      const objKeys = keys(obj)
      const extraProps = difference(objKeys, typeKeys)
      if (extraProps.length) {
        unexpected = {}
        for (let i = 0, len = extraProps.length; i < len; i++) {
          unexpected[extraProps[i]] = {
            unexpected: getTypeName(obj[extraProps[i]]),
            value: obj[extraProps[i]]
          }
        }
      }
    }

    for (let i = 0, len = typeKeys.length; i < len; i++) {
      const key = typeKeys[i]
      const result = diff(Type[key], obj[key], { subset, instanceOf })
      if (result) {
        incorrect = incorrect || {}
        assign(incorrect, { [key]: result })
      }
    }

    return unexpected || incorrect
      ? assign(unexpected || {}, incorrect || {})
      : null
  }

  const isOfType = types.get(Type)

  if ((isOfType && isOfType(obj)) || instanceOf(Type, obj)) return null

  return {
    actual: getTypeName(obj),
    expected: Type.name,
    value: obj
  }
}

const getTypeName = obj =>
  isNull(obj)
    ? 'Null'
    : isUndefined(obj)
      ? 'Undefined'
      : obj.constructor.name
