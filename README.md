type-diff
--
Simple, readable, structural type comparisons.

[![Build Status](https://travis-ci.org/thebearingedge/type-diff.svg?branch=master)](https://travis-ci.org/thebearingedge/type-diff)
[![Coverage Status](https://coveralls.io/repos/github/thebearingedge/type-diff/badge.svg?branch=master)](https://coveralls.io/github/thebearingedge/type-diff?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/thebearingedge/type-diff.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/thebearingedge/type-diff/status.svg)](https://david-dm.org/thebearingedge/type-diff)
[![devDependencies Status](https://david-dm.org/thebearingedge/type-diff/dev-status.svg)](https://david-dm.org/thebearingedge/type-diff?type=dev)

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

`diff(Type, value)`

Generate an object literal representation of the difference between your `Type` and a given `value` as shown above in the [Quick Example](#quick-example).

### Supported Built-ins

- `Number`
- `String`
- `Boolean`
- `Object`
- `Array`
- `Date`
- `Function`

### Helpers

`Nullable(Type)`: Allows the corresponding `value` to be either the correct `Type` or `null`.

`Optional(Type)`: Allows the corresponding `value` to be either the correct `Type` or `undefined`.

`Any | Any()`: Requires that the corresponding value be anything but `undefined`. Used in conjuction with `Optional` if `undefined` is allowed; as in `Optional(Any)`
