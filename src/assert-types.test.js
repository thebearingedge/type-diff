import { describe, it } from 'global'
import { expect } from 'chai'
import assertTypes from './assert-types'

describe('assertTypes(Type, obj)', () => {

  it('does not throw if an Object matches a Type', () => {
    const Type = {
      id: Number,
      name: String
    }
    const obj = {
      id: 1,
      name: 'John Doe'
    }
    expect(() => assertTypes(Type, obj)).not.to.throw()
  })

  it('throws if an Object does not match a Type', () => {
    const Type = {
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
    expect(() => assertTypes(Type, obj)).to.throw()
  })

})
