import { describe, it } from 'global'
import { expect } from 'chai'
import diff from '../src/diff'
import { Optional, Nullable } from './primitives'

describe('diff(Shape, obj)', () => {

  it('diffs a simple value', () => {
    const Shape = String
    const obj = 1
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      actual: 'Number',
      expected: 'String',
      value: 1
    })
  })

  it('diffs a simple Optional value', () => {
    const Shape = Optional(String)
    const obj = 1
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      actual: 'Number',
      expected: 'String',
      value: 1
    })
  })

  it('diffs a simple Nullable value', () => {
    const Shape = Nullable(String)
    const obj = 1
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      actual: 'Number',
      expected: 'String',
      value: 1
    })
  })

  it('ignores a missing Optional value', () => {
    const Shape = Optional(String)
    const obj = undefined
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs a correct shallow Shape', () => {
    const Shape = { name: String }
    const obj = { name: 'John Doe' }
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs an Optional shallow Shape', () => {
    const Shape = { name: Optional(String) }
    const obj = { name: undefined }
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs a Nullable shallow Shape', () => {
    const Shape = { name: Nullable(String) }
    const obj = { name: null }
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs a shallow shape with unexpected properties', () => {
    const Shape = { name: String }
    const obj = { id: 1, name: 'John Doe' }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      id: {
        unexpected: 'Number',
        value: 1
      }
    })
  })

  it('ignores unexpected properties on a shallow shape', () => {
    const Shape = { name: String }
    const obj = { id: 1, name: 'John Doe' }
    const result = diff(Shape, obj, { strict: false })
    expect(result).to.be.null
  })

  it('diffs an incorrect shallow Shape', () => {
    const Shape = { id: Number }
    const obj = { id: '1' }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      id: {
        actual: 'String',
        expected: 'Number',
        value: '1'
      }
    })
  })

  it('diffs an incorrect Optional shallow Shape', () => {
    const Shape = { id: Optional(Number) }
    const obj = { id: '1' }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      id: {
        actual: 'String',
        expected: 'Number',
        value: '1'
      }
    })
  })

  it('diffs a Shape with correct nested Objects', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: String,
        isActive: Boolean
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: true
      }
    }
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs a Shape with incorrect nested Objects', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: String,
        isActive: Boolean
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: 0
      }
    }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      attrs: {
        isActive: {
          actual: 'Number',
          expected: 'Boolean',
          value: 0
        }
      }
    })
  })

  it('diffs a Shape with unexpected nested properties', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: String,
        isActive: Boolean
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: true,
        isHandsome: true
      }
    }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      attrs: {
        isHandsome: {
          unexpected: 'Boolean',
          value: true
        }
      }
    })
  })

  it('ignores unexpected nested properties', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: String,
        isActive: Boolean
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: true,
        isHandsome: true
      }
    }
    const result = diff(Shape, obj, { strict: false })
    expect(result).to.be.null
  })

  it('diffs a Shape with undefined properties', () => {
    const Shape = {
      id: Number,
      attrs: Object
    }
    const obj = {
      id: 1
    }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      attrs: {
        actual: 'Undefined',
        expected: 'Object',
        value: undefined
      }
    })
  })

  it('diffs a Shape with null properties', () => {
    const Shape = {
      id: Number,
      attrs: Object
    }
    const obj = {
      id: 1,
      attrs: null
    }
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      attrs: {
        actual: 'Null',
        expected: 'Object',
        value: null
      }
    })
  })

  it('diffs an Array of correct primitives', () => {
    const Shape = [String]
    const obj = ['foo', 'bar', 'baz']
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs an Array of mixed primitives', () => {
    const Shape = [Boolean]
    const obj = [true, false, null]
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      '2': {
        actual: 'Null',
        expected: 'Boolean',
        value: null
      }
    })
  })

  it('diffs an Array of similar Objects', () => {
    const Shape = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]
    const result = diff(Shape, obj)
    expect(result).to.be.null
  })

  it('diffs an Array of dissimilar Objects', () => {
    const Shape = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: {}, name: 'bar' }]
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      '1': {
        id: {
          actual: 'Object',
          expected: 'Number',
          value: {}
        }
      }
    })
  })

  it('diffs an Array of dissimilar Objects with extra keys', () => {
    const Shape = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar', color: 'red' }]
    const result = diff(Shape, obj)
    expect(result).to.deep.equal({
      '1': {
        color: {
          unexpected: 'String',
          value: 'red'
        }
      }
    })
  })

  it('ignores unexpected properties on similar objects in an array', () => {
    const Shape = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar', color: 'red' }]
    const result = diff(Shape, obj, { strict: false })
    expect(result).to.be.null
  })

  it('diffs a matching complex Object', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const garfield = {
      name: 'Garfield',
      weight: 40
    }
    const odie = {
      name: 'Odie',
      weight: 17
    }
    const john = {
      name: 'John Arbuckle',
      pets: [garfield, odie]
    }
    const result = diff(Owner, john)
    expect(result).to.be.null
  })

  it('diffs an object that should include an Array', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const john = {
      name: 'John Arbuckle',
      pets: 'Garfield & Odie'
    }
    const result = diff(Owner, john)
    expect(result).to.deep.equal({
      pets: {
        actual: 'String',
        expected: 'Array',
        value: 'Garfield & Odie'
      }
    })
  })

  it('diffs a non-matching complex Object', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const garfield = {
      weight: 40
    }
    const odie = {
      name: 'Odie',
      weight: 17
    }
    const john = {
      name: 'John Arbuckle',
      pets: [garfield, odie]
    }
    const result = diff(Owner, john)
    expect(result).to.deep.equal({
      pets: {
        '0': {
          name: {
            actual: 'Undefined',
            expected: 'String',
            value: undefined
          }
        }
      }
    })
  })

  it('diffs a complex structure with unexpected properties', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const garfield = {
      name: 'Garfield',
      weight: 40
    }
    const odie = {
      name: 'Odie',
      weight: 17,
      age: 3
    }
    const john = {
      name: 'John Arbuckle',
      pets: [garfield, odie]
    }
    const result = diff(Owner, john)
    expect(result).to.deep.equal({
      pets: {
        '1': {
          age: {
            unexpected: 'Number',
            value: 3
          }
        }
      }
    })
  })

  it('ignores unexpected properties of a complex structure', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const garfield = {
      name: 'Garfield',
      weight: 40
    }
    const odie = {
      name: 'Odie',
      weight: 17,
      age: 3
    }
    const john = {
      name: 'John Arbuckle',
      pets: [garfield, odie]
    }
    const result = diff(Owner, john, { strict: false })
    expect(result).to.be.null
  })

  it('diffs unknown types', () => {
    class List {}
    const list = []
    expect(diff(List, list)).to.deep.equal({
      actual: 'Array',
      expected: 'List',
      value: []
    })
  })

})
