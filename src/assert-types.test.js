import { describe, it } from 'global'
import { expect } from 'chai'
import assertTypes from '../src/assert-types'

describe('assertTypes(Shape, obj)', () => {

  it('does not throw if an Object matches a Shape', () => {
    const Shape = {
      id: Number,
      name: String
    }
    const obj = {
      id: 1,
      name: 'John Doe'
    }
    expect(() => assertTypes(Shape, obj)).not.to.throw()
  })

  it('throws if an Object does not match a Shape', () => {
    const Shape = {
      id: Number,
      name: {
        first: String,
        last: String
      }
    }
    const obj = {
      id: 1,
      name: 'John Doe'
    }
    expect(() => assertTypes(Shape, obj)).to.throw()
  })

})
