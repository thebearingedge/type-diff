type-diff
---
Simple, readable object strucure comparison

[![Build Status](https://travis-ci.org/thebearingedge/type-diff.svg?branch=master)](https://travis-ci.org/thebearingedge/type-diff)
[![Coverage Status](https://coveralls.io/repos/github/thebearingedge/type-diff/badge.svg?branch=master)](https://coveralls.io/github/thebearingedge/type-diff?branch=master)

```js
import assert from 'assert'
import { diff, Nullable, Optional } from 'type-diff'

const Structure = {
  id: Number,
  tags: [String]
  contacts: [{
    id: Number,
    name: String,
    contacted: Nullable(Date),
    tags: Optional([String])
  }]
}

const data = {
  id: 1,
  tags: ['good', 'cool'],
  contacts: [
    { id: 2, name: 'John Doe', contacted: null },
    { id: '3', name: 'Jane Doe', contacted: new Date(), tags: ['cool'] }
  ]
}

assert.deepEqual(diff(Structure, data), {
  contacts: {
    '1': {
      id: {
         actual: 'String',
         expected: 'Number',
         value: '3'
      }
    }
  }
})
```
