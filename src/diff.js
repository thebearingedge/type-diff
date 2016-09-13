import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { types, Optional, Nullable, Any } from './types'

const { keys, assign } = Object
const is = (Type, value) => value instanceof Type

export default function diff(Type, value, { subset=false, instanceOf=is } = {}) {

  const options = { subset, instanceOf }

  if (Type === Any || Type instanceof Any) return null

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
        value: value
      }
    }

    let result = null

    for (let i = 0, len = value.length; i < len; i++) {
      const incorrect = diff(Type[0], value[i], options)
      if (incorrect) {
        result = result || {}
        result[i] = incorrect
      }
    }

    return result
  }

  if (isPlainObject(Type)) {

    let unexpected = null
    let incorrect = null
    const typeKeys = keys(Type)

    if (!subset) {
      const valueKeys = keys(value)
      const extraProps = difference(valueKeys, typeKeys)
      if (extraProps.length) {
        unexpected = {}
        for (let i = 0, len = extraProps.length; i < len; i++) {
          const extraProp = extraProps[i]
          unexpected[extraProps] = {
            unexpected: getTypeName(value[extraProp]),
            value: value[extraProp]
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
