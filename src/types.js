import { isString,
         isNumber,
         isBoolean,
         isPlainObject,
         isArray,
         isDate,
         isUndefined,
         isNull } from 'lodash'

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
  this.is = isUndefined
}

export function Nullable(Type) {
  if (!(this instanceof Nullable)) {
    return new Nullable(Type)
  }
  this.Type = Type
  this.is = isNull
}

export const types = new Map([
  [String, isString],
  [Number, isNumber],
  [Boolean, isBoolean],
  [Object, isPlainObject],
  [Array, isArray],
  [Date, isDate]
])
