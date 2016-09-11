import { describe, it } from 'global'
import { expect } from 'chai'
import diff from './diff'
import { Optional, Nullable, Any } from './primitives'

describe('diff(Type, obj)', () => {

  it('diffs Any value', () => {
    const Type = Any
    const obj = null
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs a call to Any()', () => {
    const Type = Any()
    const obj = null
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs a simple value', () => {
    const Type = String
    const obj = 1
    expect(diff(Type, obj)).to.deep.equal({
      actual: 'Number',
      expected: 'String',
      value: 1
    })
  })

  it('diffs a simple Optional value', () => {
    const Type = Optional(String)
    const obj = 1
    expect(diff(Type, obj)).to.deep.equal({
      actual: 'Number',
      expected: 'String',
      value: 1
    })
  })

  it('diffs a simple Nullable value', () => {
    const Type = Nullable(String)
    const obj = 1
    expect(diff(Type, obj)).to.deep.equal({
      actual: 'Number',
      expected: 'String',
      value: 1
    })
  })

  it('ignores a missing Optional value', () => {
    const Type = Optional(String)
    const obj = undefined
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs a correct shallow Type', () => {
    const Type = { name: String }
    const obj = { name: 'John Doe' }
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs an Optional shallow Type', () => {
    const Type = { name: Optional(String) }
    const obj = { name: undefined }
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs a Nullable shallow Type', () => {
    const Type = { name: Nullable(String) }
    const obj = { name: null }
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs a shallow shape with unexpected properties', () => {
    const Type = { name: String }
    const obj = { id: 1, name: 'John Doe' }
    const result = diff(Type, obj)
    expect(result).to.deep.equal({
      id: {
        unexpected: 'Number',
        value: 1
      }
    })
  })

  it('ignores unexpected properties on a shallow shape', () => {
    const Type = { name: String }
    const obj = { id: 1, name: 'John Doe' }
    expect(diff(Type, obj, { strict: false })).to.be.null
  })

  it('diffs an incorrect shallow Type', () => {
    const Type = { id: Number }
    const obj = { id: '1' }
    expect(diff(Type, obj)).to.deep.equal({
      id: {
        actual: 'String',
        expected: 'Number',
        value: '1'
      }
    })
  })

  it('diffs all incorrect object properties', () => {
    const Type = {
      id: Number,
      name: String
    }
    const now = new Date()
    const data = { id: now, name: 42 }
    expect(diff(Type, data)).to.deep.equal({
      id: {
        actual: 'Date',
        expected: 'Number',
        value: now
      },
      name: {
        actual: 'Number',
        expected: 'String',
        value: 42
      }
    })
  })

  it('diffs an incorrect Optional shallow Type', () => {
    const Type = { id: Optional(Number) }
    const obj = { id: '1' }
    expect(diff(Type, obj)).to.deep.equal({
      id: {
        actual: 'String',
        expected: 'Number',
        value: '1'
      }
    })
  })

  it('diffs a Type with correct nested Objects', () => {
    const Type = {
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
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs a Type with incorrect nested Objects', () => {
    const Type = {
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
    expect(diff(Type, obj)).to.deep.equal({
      attrs: {
        isActive: {
          actual: 'Number',
          expected: 'Boolean',
          value: 0
        }
      }
    })
  })

  it('diffs a Type with unexpected nested properties', () => {
    const Type = {
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
    expect(diff(Type, obj)).to.deep.equal({
      attrs: {
        isHandsome: {
          unexpected: 'Boolean',
          value: true
        }
      }
    })
  })

  it('ignores unexpected nested properties', () => {
    const Type = {
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
    expect(diff(Type, obj, { strict: false })).to.be.null
  })

  it('diffs a Type with undefined properties', () => {
    const Type = {
      id: Number,
      attrs: Object
    }
    const obj = {
      id: 1
    }
    expect(diff(Type, obj)).to.deep.equal({
      attrs: {
        actual: 'Undefined',
        expected: 'Object',
        value: undefined
      }
    })
  })

  it('diffs a Type with null properties', () => {
    const Type = {
      id: Number,
      attrs: Object
    }
    const obj = {
      id: 1,
      attrs: null
    }
    expect(diff(Type, obj)).to.deep.equal({
      attrs: {
        actual: 'Null',
        expected: 'Object',
        value: null
      }
    })
  })

  it('diffs an Array of correct primitives', () => {
    const Type = [String]
    const obj = ['foo', 'bar', 'baz']
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs an Array of mixed primitives', () => {
    const Type = [Boolean]
    const obj = [true, false, null, 1]
    expect(diff(Type, obj)).to.deep.equal({
      '2': {
        actual: 'Null',
        expected: 'Boolean',
        value: null
      },
      '3': {
        actual: 'Number',
        expected: 'Boolean',
        value: 1
      }
    })
  })

  it('diffs an Array of similar Objects', () => {
    const Type = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]
    expect(diff(Type, obj)).to.be.null
  })

  it('diffs an Array of dissimilar Objects', () => {
    const Type = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: {}, name: 'bar' }]
    expect(diff(Type, obj)).to.deep.equal({
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
    const Type = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar', color: 'red' }]
    expect(diff(Type, obj)).to.deep.equal({
      '1': {
        color: {
          unexpected: 'String',
          value: 'red'
        }
      }
    })
  })

  it('ignores unexpected properties on similar objects in an array', () => {
    const Type = [{ id: Number, name: String }]
    const obj = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar', color: 'red' }]
    expect(diff(Type, obj, { strict: false })).to.be.null
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
    expect(diff(Owner, john)).to.be.null
  })

  it('diffs an object that should include an Array', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const john = {
      name: 'John Arbuckle',
      pets: 'Garfield & Odie'
    }
    expect(diff(Owner, john)).to.deep.equal({
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
    expect(diff(Owner, john)).to.deep.equal({
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

  it('diffs a complex structure with incorrect properties', () => {
    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }
    const garfield = {
      name: 'Garfield',
      weight: 40
    }
    const odie = {
      name: 'Odie',
      weight: '17',
      age: 3
    }
    const john = {
      name: 'John Arbuckle',
      pets: [garfield, odie]
    }
    expect(diff(Owner, john)).to.deep.equal({
      pets: {
        '1': {
          age: {
            unexpected: 'Number',
            value: 3
          },
          weight: {
            actual: 'String',
            expected: 'Number',
            value: '17'
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
    expect(diff(Owner, john, { strict: false })).to.be.null
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
