import { isString,
         isNumber,
         isBoolean,
         isPlainObject,
         isArray,
         isDate } from 'lodash'

export function Optional(Shape) {
  if (!(this instanceof Optional)) {
    return new Optional(Shape)
  }
  this.Shape = Shape
}

export function Nullable(Shape) {
  if (!(this instanceof Nullable)) {
    return new Nullable(Shape)
  }
  this.Shape = Shape
}

export const types = new Map([
  [String, isString],
  [Number, isNumber],
  [Boolean, isBoolean],
  [Object, isPlainObject],
  [Array, isArray],
  [Date, isDate]
])
