import { isNull, isUndefined, isPlainObject, isArray } from 'lodash'
import types from './types'

export default function diff(Shape, obj) {

  if (isArray(Shape)) {

    if (!isArray(obj)) {
      return {
        actual: getTypeName(obj),
        expected: 'Array',
        value: obj
      }
    }

    for (let i = 0; i < obj.length; i++) {
      const result = diff(Shape[0], obj[i])
      if (result) return { [i]: result }
    }
  }

  if (isPlainObject(Shape)) {
    for (let key in Shape) {
      const result = diff(Shape[key], obj[key])
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
