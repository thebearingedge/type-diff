import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import { primitives, Optional, Nullable } from './primitives'

const { keys, assign } = Object

export default function diff(Shape, obj, options = {}) {

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

    for (let i = 0, len = obj.length; i < len; i++) {
      const result = diff(Shape[0], obj[i], { strict })
      if (result) return { [i]: result }
    }

    return null
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

  const isOfType = primitives.get(Shape) || (obj => obj instanceof Shape)

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
