Simple, readable, structural type comparisons

[![Build Status](https://travis-ci.org/thebearingedge/type-diff.svg?branch=master)](https://travis-ci.org/thebearingedge/type-diff)
[![Coverage Status](https://coveralls.io/repos/github/thebearingedge/type-diff/badge.svg?branch=master)](https://coveralls.io/github/thebearingedge/type-diff?branch=master)

### Quick Example

```js
import assert from 'assert'
import { diff, Nullable, Optional, Any } from 'type-diff'

const Type = {
  id: Number,
  tags: [String]
  contacts: [{
    id: Number,
    name: String,
    contacted: Nullable(Date),
    tags: Optional([String]),
    wharrgarbl: Any()
  }]
}

const value = {
  id: 1,
  tags: ['good', 'cool'],
  contacts: [
    { id: 2, name: 'John Doe', contacted: null, wharrgarbl: _ => 'wheee' },
    { id: '3', name: 'Jane Doe', contacted: new Date(), tags: ['cool'] }
  ]
}

assert.deepEqual(diff(Type, value), {
  contacts: {
    '1': {
      id: {
        actual: 'String',
        expected: 'Number',
        value: '3'
      },
      wharrgarbl: {
        actual: 'Undefined',
        expected: 'Any'
      }
    }
  }
})
```
### Usage

`diff(Type, value[, options])`

Generate an object literal representation of the difference between your `Type` and a given `value` as shown above in the [Quick Example](#quick-example).

### Supported Built-ins

- `Number`
- `String`
- `Boolean`
- `Object`
- `Array`
- `Date`
- `Function`

### Options

Defaults:

```js
{
  subset: false,
  instanceOf: (Type, value) => value instanceof Type
}
```

`subset`: when `true`, extra properties on object values will be ignored.

```js
const Type = { name: String }
const value = { id: 1, name: 'John Doe' }

assert.equal(diff(Type, value, { subset: true }), null)
```

`instanceOf`: used to check whether a `value` is an instance of a `Type`. This can be overridden in the case that a given value cannot be a `Subtype`.

Example:
```js
class Type {}
class Subtype extends Type {}
const value = new Subtype()
const instanceOf = (Type, value) => value.constructor === Type

assert.deepEqual(diff(Type, value, { instanceOf }), {
  actual: 'Subtype',
  expected: 'Type',
  value: {}
})
```

### Helpers

`Nullable(Type)`: Allows the corresponding `value` to be either the correct `Type` or `null`.

`Optional(Type)`: Allows the corresponding `value` to be either the correct `Type` or `undefined`.

`Any | Any()`: Requires that the corresponding value be anything but `undefined`. Used in conjuction with `Optional` if `undefined` is allowed; as in `Optional(Any)`
