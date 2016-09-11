import { describe, it } from 'global'
import { expect } from 'chai'
import assertTypes from './assert-types'

describe('assertTypes(Type, value)', () => {

  it('does not throw if a value matches a Type', () => {
    const Type = { id: Number, name: String }
    const obj = { id: 1, name: 'John Doe' }
    expect(() => assertTypes(Type, obj)).not.to.throw()
  })

  it('throws if a value does not match a Type', () => {
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
