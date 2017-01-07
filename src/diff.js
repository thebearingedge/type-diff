import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { types, Optional, Nullable, Any } from './types'

const { keys, assign } = Object
const is = (Type, value) => value instanceof Type

export default function diff(Type, value, { subset=false, instanceOf=is } = {}) {

  const options = { subset, instanceOf }

  if (Type === Any || Type instanceof Any) {
    return isUndefined(value)
      ? { actual: 'Undefined', expected: 'Any' }
      : null
  }

  if (Type instanceof Optional || Type instanceof Nullable) {
    return Type.is(value)
      ? null
      : diff(Type.Type, value, options)
  }

  if (isArray(Type)) {

    if (!isArray(value)) {
      return {
        actual: getTypeName(value),
        expected: 'Array',
        value
      }
    }

    let result = null

    for (let v = 0, vLen = value.length; v < vLen; v++) {
      let matched = false
      let incorrect = null
      let t, tLen
      for (t = 0, tLen = Type.length; t < tLen; t++) {
        incorrect = diff(Type[t], value[v], options)
        if (!incorrect) {
          matched = true
          break
        }
      }
      if (matched) continue
      result = result || {}
      result[v] = incorrect
    }

    return result
  }

  if (isPlainObject(Type)) {

    let unexpected = null
    let incorrect = null
    const typeKeys = keys(Type)

    if (!subset) {
      const valueKeys = keys(value)
      const extraKeys = difference(valueKeys, typeKeys)
      if (extraKeys.length) {
        unexpected = {}
        for (let i = 0, len = extraKeys.length; i < len; i++) {
          const extraKey = extraKeys[i]
          unexpected[extraKey] = {
            unexpected: getTypeName(value[extraKey]),
            value: value[extraKey]
          }
        }
      }
    }

    for (let i = 0, len = typeKeys.length; i < len; i++) {
      const typeKey = typeKeys[i]
      const result = diff(Type[typeKey], value[typeKey], options)
      if (result) {
        incorrect = incorrect || {}
        incorrect[typeKey] = result
      }
    }

    return unexpected || incorrect
      ? assign(unexpected || {}, incorrect || {})
      : null
  }

  const isOfType = types.get(Type)

  if ((isOfType && isOfType(value)) || instanceOf(Type, value)) return null

  return {
    actual: getTypeName(value),
    expected: Type.name,
    value
  }
}

const getTypeName = value =>
  isNull(value)
    ? 'Null'
    : isUndefined(value)
      ? 'Undefined'
      : value.constructor.name
