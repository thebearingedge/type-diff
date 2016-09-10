import { isString,
         isNumber,
         isBoolean,
         isPlainObject,
         isArray,
         isDate } from 'lodash'

export default new Map([
  [String, isString],
  [Number, isNumber],
  [Boolean, isBoolean],
  [Object, isPlainObject],
  [Array, isArray],
  [Date, isDate]
])
