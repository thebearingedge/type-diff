import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { primitives, Optional, Nullable, Any } from './primitives'

const { keys, assign } = Object

export default function diff(Shape, obj, options = {}) {

  if (Shape === Any || Shape instanceof Any) return null

  const { strict } = assign({}, { strict: true }, options)

  if (Shape instanceof Optional) {
    if (isUndefined(obj)) return null
    return diff(Shape.Shape, obj, { strict })
  }

  if (Shape instanceof Nullable) {
    if (isNull(obj)) return null
    return diff(Shape.Shape, obj, { strict })
  }

  if (isArray(Shape)) {

    if (!isArray(obj)) {
      return {
        actual: getTypeName(obj),
        expected: 'Array',
        value: obj
      }
    }

    let result = null

    for (let i = 0, len = obj.length; i < len; i++) {
      const incorrect = diff(Shape[0], obj[i], { strict })
      if (incorrect) {
        result = result || {}
        result[i] = incorrect
      }
    }

    return result
  }

  if (isPlainObject(Shape)) {

    const shapeKeys = keys(Shape)
    let unexpected = null
    let incorrect = null

    if (strict) {
      const objKeys = keys(obj)
      const extraKeys = difference(objKeys, shapeKeys)
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

    for (let i = 0, len = shapeKeys.length; i < len; i++) {
      const key = shapeKeys[i]
      const result = diff(Shape[key], obj[key], { strict })
      if (result) {
        incorrect = incorrect || {}
        assign(incorrect, { [key]: result })
      }
    }

    return unexpected || incorrect
      ? assign(unexpected || {}, incorrect || {})
      : null
  }

  const isOfType = primitives.get(Shape) || (obj => obj.constructor === Shape)

  if (!isOfType(obj)) {
    return {
      actual: getTypeName(obj),
      expected: Shape.name,
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
