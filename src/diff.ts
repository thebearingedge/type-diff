import { Any, Nullable, Optional, Description } from './helpers'

type Diff = {
  actual: Description
  expected: Description
  value?: any
} | {
  [key: string]: {
    unexpected: string
    value: any
  } | Diff
}

const TYPE_NAME_REGEX = /\[object (.+)\]/

function getTypeName(value: any): string {
  const asString = Object.prototype.toString.call(value)
  return (asString.match(TYPE_NAME_REGEX) as RegExpMatchArray)[1]
}

function isPlainObject(value: any): boolean {
  return getTypeName(value) === 'Object'
}

export default function diff(description: Description, value: any): Diff | null {

  if (value === description) return null

  if (description === Any) {
    return typeof value !== 'undefined'
      ? null
      : { actual: 'Undefined', expected: 'Any', value }
  }

  if (typeof description === 'bigint' ||
      typeof description === 'boolean' ||
      typeof description === 'number' ||
      typeof description === 'string' ||
      typeof description === 'symbol') {
    return { actual: value, expected: description }
  }

  if (description == null) {
    return { actual: getTypeName(value), expected: getTypeName(description), value }
  }

  if (description instanceof Optional || description instanceof Nullable) {
    return description.is(value)
      ? null
      : diff(description.description, value)
  }

  if ((description === Array && !Array.isArray(value)) ||
      (description === Object && !isPlainObject(value))) {
    return { actual: getTypeName(value), expected: description.name, value }
  }

  if (typeof description === 'function') {
    if (value instanceof description) return null
    const valueType = getTypeName(value)
    if (valueType === description.name) return null
    return { actual: valueType, expected: description.name, value }
  }

  if (Array.isArray(description)) {
    if (!Array.isArray(value)) {
      return { actual: getTypeName(value), expected: 'Array', value }
    }
    let result: Diff | null = null
    for (let v = 0; v < value.length; v++) {
      let incorrect: Diff | null = null
      incorrect = diff(description[0], value[v])
      if (incorrect == null) continue
      result = result ?? {}
      result[v] = incorrect
    }
    return result
  }

  if (isPlainObject(description) && !isPlainObject(value)) {
    return { actual: getTypeName(value), expected: 'Object', value }
  }

  let incorrect: Diff | null = null
  let unexpected: Diff | null = null

  const valueKeys = Object.keys(value)
  const descriptionKeys = Object.keys(description)

  for (let i = 0; i < valueKeys.length; i++) {
    const key = valueKeys[i]
    if (!(key in description)) {
      unexpected = unexpected ?? {}
      unexpected[key] = {
        unexpected: getTypeName(value[key]),
        value: value[key]
      }
    }
  }

  for (let i = 0; i < descriptionKeys.length; i++) {
    const key = descriptionKeys[i]
    const result = diff(description[key], value[key])
    if (result != null) {
      incorrect = incorrect ?? {}
      incorrect[key] = result
    }
  }

  return unexpected != null || incorrect != null
    ? Object.assign(unexpected ?? {}, incorrect ?? {})
    : null

}
