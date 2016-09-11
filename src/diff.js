import { isNull, isUndefined, isPlainObject, isArray, difference } from 'lodash'
import types from './types'

export default function diff(Shape, obj, options = {}) {

  const { strict } = Object.assign({}, { strict: true }, options)

  if (isArray(Shape)) {

    if (!isArray(obj)) {
      return {
        actual: getTypeName(obj),
        expected: 'Array',
        value: obj
      }
    }

    for (let i = 0; i < obj.length; i++) {
      const result = diff(Shape[0], obj[i], { strict })
      if (result) return { [i]: result }
    }
  }

  if (isPlainObject(Shape)) {

    const shapeKeys = Object.keys(Shape)

    if (strict) {
      const objKeys = Object.keys(obj)
      const extraKeys = difference(objKeys, shapeKeys)
        .filter(key => !shapeKeys.includes(key))
      if (extraKeys.length) {
        return extraKeys.reduce((extra, key) => Object.assign(extra, {
          [key]: {
            unexpected: getTypeName(obj[key]),
            value: obj[key]
          }
        }), {})
      }
    }

    for (let i = 0, len = shapeKeys.length; i < len; i++) {
      const key = shapeKeys[i]
      const result = diff(Shape[key], obj[key], { strict })
      if (result) return { [key]: result }
    }
  }

  const isType = types.get(Shape)

  if (isType && !isType(obj)) {
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
