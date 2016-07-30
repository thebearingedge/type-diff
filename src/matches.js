import { isArray, isPlainObject } from 'lodash'
import types from './types'


export default function matches(Shape, value) {

  const isType = types.get(Shape)

  if (isType) return isType(value)

  if (isArray(Shape)) {
    return isArray(value) && value.every(child => matches(Shape[0], child))
  }

  if (isPlainObject(Shape)) {
    return Object.keys(Shape).every(key => matches(Shape[key], value[key]))
  }

  return false
}
