import { isString,
         isNumber,
         isBoolean,
         isPlainObject,
         isArray,
         isDate } from 'lodash'

export function Any() {
  if (!(this instanceof Any)) {
    return new Any()
  }
}

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

export const primitives = new Map([
  [String, isString],
  [Number, isNumber],
  [Boolean, isBoolean],
  [Object, isPlainObject],
  [Array, isArray],
  [Date, isDate]
])
