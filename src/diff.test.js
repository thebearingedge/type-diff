import { describe, context, it } from 'global'
import { expect } from 'chai'
import diff from './diff'
import { Optional, Nullable, Any } from './primitives'

describe('diff(Type, value)', () => {

  context('when Type is a primitive', () => {

    it('diffs an Any Type', () => {
      expect(diff(Any, null)).to.be.null
    })

    it('diffs an instance of an Any Type', () => {
      expect(diff(Any(), null)).to.be.null
    })

    it('diffs a primitive Type', () => {
      expect(diff(Boolean, 1)).to.deep.equal({
        actual: 'Number',
        expected: 'Boolean',
        value: 1
      })
    })

    it('diffs an Optional Type', () => {
      expect(diff(Optional(String), 1)).to.deep.equal({
        actual: 'Number',
        expected: 'String',
        value: 1
      })
    })

    it('diffs a Nullable Type', () => {
      expect(diff(Nullable(String), true)).to.deep.equal({
        actual: 'Boolean',
        expected: 'String',
        value: true
      })
    })

    it('diffs a missing Optional Type', () => {
      expect(diff(Optional(String), undefined)).to.be.null
    })

    it('diffs an unknown Type', () => {
      class List {}
      const list = []
      expect(diff(List, list)).to.deep.equal({
        actual: 'Array',
        expected: 'List',
        value: []
      })
    })

  })

  context('when the Type is a shallow Object', () => {

    it('diffs a correct shallow Type', () => {
      const Type = { name: String }
      const obj = { name: 'John Doe' }
      expect(diff(Type, obj)).to.be.null
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

    it('diffs undefined properties', () => {
      const Type = { id: Number, attrs: Object }
      const obj = { id: 1 }
      expect(diff(Type, obj)).to.deep.equal({
        attrs: {
          actual: 'Undefined',
          expected: 'Object',
          value: undefined
        }
      })
    })

    it('diffs null properties', () => {
      const Type = { id: Number, attrs: Object }
      const obj = { id: 1, attrs: null }
      expect(diff(Type, obj)).to.deep.equal({
        attrs: {
          actual: 'Null',
          expected: 'Object',
          value: null
        }
      })
    })

    it('diffs a correct Optional property', () => {
      const Type = { name: Optional(String) }
      const obj = { name: undefined }
      expect(diff(Type, obj)).to.be.null
    })

    it('diffs a Nullable property', () => {
      const Type = { name: Nullable(String) }
      const obj = { name: null }
      expect(diff(Type, obj)).to.be.null
    })

    it('diffs an incorrect Optional property', () => {
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

    it('diffs all incorrect properties', () => {
      const Type = { id: Number, name: String }
      const now = new Date()
      const obj = { id: now, name: 42 }
      expect(diff(Type, obj)).to.deep.equal({
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

    it('diffs unexpected properties', () => {
      const Type = { name: String }
      const obj = { id: 1, name: 'John Doe' }
      expect(diff(Type, obj)).to.deep.equal({
        id: {
          unexpected: 'Number',
          value: 1
        }
      })
    })

    it('diffs an incorrect Array property', () => {
      const Type = { name: String, pets: [{ name: String, weight: Number }] }
      const obj = {
        name: 'John Arbuckle',
        pets: 'Garfield & Odie'
      }
      expect(diff(Type, obj)).to.deep.equal({
        pets: {
          actual: 'String',
          expected: 'Array',
          value: 'Garfield & Odie'
        }
      })
    })

    context('when `strict` option is `false`', () => {

      it('ignores unexpected properties', () => {
        const Type = { name: String }
        const obj = { id: 1, name: 'John Doe' }
        expect(diff(Type, obj, { strict: false })).to.be.null
      })

    })

  })

  context('when Type is a nested Object', () => {

    it('diffs all correct nested properties', () => {
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

    it('diffs incorrect nested properties', () => {
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

    it('diffs unexpected nested properties', () => {
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

    context('when `strict` option is `false`', () => {

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

    })

  })

  context('when Type is an array', () => {

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

  })

  context('when type is a complex Object', () => {

    const Pet = { name: String, weight: Number }
    const Owner = { name: String, pets: [Pet] }

    it('diffs correct complex properties', () => {
      const owner = {
        name: 'John Arbuckle',
        pets: [
          { name: 'Garfield', weight: 40 },
          { name: 'Odie', weight: 17 }
        ]
      }
      expect(diff(Owner, owner)).to.be.null
    })

    it('diffs incorrect complex properties', () => {
      const owner = {
        name: 'John Arbuckle',
        pets: [
          { weight: 40 },
          { name: 'Odie', weight: 17 }
        ]
      }
      expect(diff(Owner, owner)).to.deep.equal({
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

    it('diffs a unexpected complex properties', () => {
      const owner = {
        name: 'John Arbuckle',
        pets: [
          { name: 'Garfield', weight: 40 },
          { name: 'Odie', weight: '17', age: 3 }
        ]
      }
      expect(diff(Owner, owner)).to.deep.equal({
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

    context('when `strict` option is `false`', () => {

      it('ignores unexpected complex properties', () => {
        const owner = {
          name: 'John Arbuckle',
          pets: [
            { name: 'Garfield', weight: 40 },
            { name: 'Odie', weight: 17, isSmart: false }
          ]
        }
        expect(diff(Owner, owner, { strict: false })).to.be.null
      })

    })

  })

})
