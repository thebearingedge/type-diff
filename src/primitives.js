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

export function Optional(Type) {
  if (!(this instanceof Optional)) {
    return new Optional(Type)
  }
  this.Type = Type
}

export function Nullable(Type) {
  if (!(this instanceof Nullable)) {
    return new Nullable(Type)
  }
  this.Type = Type
}

export const primitives = new Map([
  [String, isString],
  [Number, isNumber],
  [Boolean, isBoolean],
  [Object, isPlainObject],
  [Array, isArray],
  [Date, isDate]
])
