import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { types, Optional, Nullable, Any } from './types'

const { keys, assign } = Object
const is = (Type, value) => value instanceof Type

export default function diff(Type, value, { subset=false, instanceOf=is } = {}) {

  if (Type === Any || Type instanceof Any) return null

  if (Type instanceof Optional) {
    if (isUndefined(value)) return null
    return diff(Type.Type, value, { subset, instanceOf })
  }

  if (Type instanceof Nullable) {
    if (isNull(value)) return null
    return diff(Type.Type, value, { subset, instanceOf })
  }

  if (isArray(Type)) {

    if (!isArray(value)) {
      return {
        actual: getTypeName(value),
        expected: 'Array',
        value: value
      }
    }

    let result = null

    for (let i = 0, len = value.length; i < len; i++) {
      const incorrect = diff(Type[0], value[i], { subset, instanceOf })
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
      const valueKeys = keys(value)
      const extraProps = difference(valueKeys, typeKeys)
      if (extraProps.length) {
        unexpected = {}
        for (let i = 0, len = extraProps.length; i < len; i++) {
          unexpected[extraProps[i]] = {
            unexpected: getTypeName(value[extraProps[i]]),
            value: value[extraProps[i]]
          }
        }
      }
    }

    for (let i = 0, len = typeKeys.length; i < len; i++) {
      const key = typeKeys[i]
      const result = diff(Type[key], value[key], { subset, instanceOf })
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

  if ((isOfType && isOfType(value)) || instanceOf(Type, value)) return null

  return {
    actual: getTypeName(value),
    expected: Type.name,
    value: value
  }
}

const getTypeName = value =>
  isNull(value)
    ? 'Null'
    : isUndefined(value)
      ? 'Undefined'
      : value.constructor.name
