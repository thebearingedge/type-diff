/* global describe, it */
import { expect } from 'chai'
import diff from '../src/diff'


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

  it('diffs a correct shallow Shape', () => {

    const Shape = { name: String }

    const obj = { name: 'John Doe' }

    const result = diff(Shape, obj)

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

})
