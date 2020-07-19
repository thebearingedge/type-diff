import 'mocha'
import { expect } from 'chai'
import diff from './diff'
import { Any, OptionalConstructor as Optional, NullableConstructor as Nullable } from './helpers'

describe('diff(description, value)', () => {

  describe('undefined', () => {

    it('matches undefined', () => {
      expect(diff(undefined, undefined)).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], true, 1, {}, ''].forEach(value => {
        expect(diff(undefined, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Undefined',
          value
        })
      })
      expect(diff(undefined, null)).to.deep.equal({
        actual: 'Null',
        expected: 'Undefined',
        value: null
      })
    })

  })

  describe('null', () => {

    it('matches null', () => {
      expect(diff(null, null)).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], true, 1, {}, ''].forEach(value => {
        expect(diff(null, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Null',
          value
        })
      })
      expect(diff(null, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Null',
        value: undefined
      })
    })

  })

  describe('Boolean', () => {

    it('matches any boolean', () => {
      expect(diff(Boolean, true)).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], 1, {}, ''].forEach(value => {
        expect(diff(Boolean, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Boolean',
          value
        })
      })
      expect(diff(Boolean, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Boolean',
        value: undefined
      })
      expect(diff(Boolean, null)).to.deep.equal({
        actual: 'Null',
        expected: 'Boolean',
        value: null
      })
    })

  })

  describe('Boolean literal', () => {

    it('matches the same boolean', () => {
      expect(diff(true, true)).to.equal(null)
    })

    it('does not match any other boolean', () => {
      expect(diff(true, false)).to.deep.equal({
        actual: false,
        expected: true
      })
    })

  })

  describe('String', () => {

    it('matches any string', () => {
      expect(diff(String, 'test')).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], true, 1, {}].forEach(value => {
        expect(diff(String, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'String',
          value
        })
      })
      expect(diff(String, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'String',
        value: undefined
      })
      expect(diff(String, null)).to.deep.equal({
        actual: 'Null',
        expected: 'String',
        value: null
      })
    })

  })

  describe('String literal', () => {

    it('matches the same string', () => {
      expect(diff('test', 'test')).to.equal(null)
    })

    it('does not match any other string', () => {
      expect(diff('yes', 'no')).to.deep.equal({
        actual: 'no',
        expected: 'yes'
      })
    })

  })

  describe('Number', () => {

    it('matches any number', () => {
      expect(diff(Number, 1)).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], true, {}, ''].forEach(value => {
        expect(diff(Number, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Number',
          value
        })
      })
      expect(diff(Number, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Number',
        value: undefined
      })
      expect(diff(Number, null)).to.deep.equal({
        actual: 'Null',
        expected: 'Number',
        value: null
      })
    })

  })

  describe('Number literal', () => {

    it('matches the same number', () => {
      expect(diff(1, 1)).to.equal(null)
    })

    it('does not match any other number', () => {
      expect(diff(0, 1)).to.deep.equal({
        actual: 1,
        expected: 0
      })
    })

  })

  describe('CustomClass', () => {

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class CustomClass {}

    it('matches a custom class', () => {
      expect(diff(CustomClass, CustomClass)).to.equal(null)
    })

    it('matches instances of a custom class', () => {
      expect(diff(CustomClass, new CustomClass())).to.equal(null)
    })

  })

  describe('Array', () => {

    it('matches arrays', () => {
      expect(diff(Array, [])).to.equal(null)
    })

    it('does not match any other type', () => {
      [true, 1, {}, ''].forEach(value => {
        expect(diff(Array, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Array',
          value
        })
      })
      expect(diff(Array, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Array',
        value: undefined
      })
      expect(diff(Array, null)).to.deep.equal({
        actual: 'Null',
        expected: 'Array',
        value: null
      })
    })

  })

  describe('Array literal', () => {

    it('matches an empty array', () => {
      expect(diff([], [])).to.equal(null)
    })

    it('does not match any other type', () => {
      [true, 1, {}, ''].forEach(value => {
        expect(diff([], value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Array',
          value
        })
      })
      expect(diff([], undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Array',
        value: undefined
      })
      expect(diff([], null)).to.deep.equal({
        actual: 'Null',
        expected: 'Array',
        value: null
      })
    })

  })

  describe('Object', () => {

    it('matches objects', () => {
      expect(diff(Object, {})).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], true, 1, ''].forEach(value => {
        expect(diff(Object, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Object',
          value
        })
      })
      expect(diff(Object, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Object',
        value: undefined
      })
      expect(diff(Object, null)).to.deep.equal({
        actual: 'Null',
        expected: 'Object',
        value: null
      })
    })

    it('does not match incorrect indexes', () => {
      expect(diff([String], ['foo', 1, 'bar', true])).to.deep.equal({
        1: {
          actual: 'Number',
          expected: 'String',
          value: 1
        },
        3: {
          actual: 'Boolean',
          expected: 'String',
          value: true
        }
      })
    })

  })

  describe('Object literal', () => {

    it('matches an empty object', () => {
      expect(diff({}, {})).to.equal(null)
    })

    it('does not match any other type', () => {
      [[], true, 1, ''].forEach(value => {
        expect(diff({}, value)).to.deep.equal({
          actual: value.constructor.name,
          expected: 'Object',
          value
        })
      })
      expect(diff({}, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Object',
        value: undefined
      })
      expect(diff({}, null)).to.deep.equal({
        actual: 'Null',
        expected: 'Object',
        value: null
      })
    })

    it('does not match incorrect keys', () => {
      const description = {
        foo: String,
        bar: Number,
        baz: Boolean
      }
      const value = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      }
      expect(diff(description, value)).to.deep.equal({
        bar: {
          actual: 'String',
          expected: 'Number',
          value: 'bar'
        },
        baz: {
          actual: 'String',
          expected: 'Boolean',
          value: 'baz'
        }
      })
    })

    it('does not match unexpected keys', () => {
      const description = {
        foo: String
      }
      const value = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      }
      expect(diff(description, value)).to.deep.equal({
        bar: {
          unexpected: 'String',
          value: 'bar'
        },
        baz: {
          unexpected: 'String',
          value: 'baz'
        }
      })
    })

  })

  describe('Any', () => {

    it('does not match undefined', () => {
      expect(diff(Any, undefined)).to.deep.equal({
        actual: 'Undefined',
        expected: 'Any',
        value: undefined
      })
    })

    it('matches any other type', () => {
      [[], true, null, 1, {}, ''].forEach(value => {
        expect(diff(Any, value)).to.equal(null)
      })
    })

  })

  describe('Optional<T>', () => {

    it('matches undefined', () => {
      [Boolean, null, Number, String].forEach(description => {
        expect(diff(Optional(description), undefined)).to.equal(null)
      })
    })

    it('matches its wrapped type', () => {
      [
        [Boolean, true],
        [null, null],
        [Number, 1],
        [String, '']
      ].forEach(([description, value]) => {
        expect(diff(Optional(description), value)).to.equal(null)
      })
    })

  })

  describe('Nullable<T>', () => {

    it('matches null', () => {
      [Boolean, Number, String, undefined].forEach(description => {
        expect(diff(Nullable(description), null)).to.equal(null)
      })
    })

    it('matches its wrapped type', () => {
      [
        [Boolean, true],
        [Number, 1],
        [String, ''],
        [undefined, undefined]
      ].forEach(([description, value]) => {
        expect(diff(Nullable(description), value)).to.equal(null)
      })
    })

  })

  describe('nested types', () => {

    it('diffs all correct nested properties', () => {
      const description = {
        id: Number,
        attrs: {
          name: String,
          isActive: Boolean
        }
      }
      const value = {
        id: 1,
        attrs: {
          name: 'John Doe',
          isActive: true
        }
      }
      expect(diff(description, value)).to.equal(null)
    })

    it('diffs incorrect nested properties', () => {
      const description = {
        id: Number,
        attrs: {
          name: String,
          isActive: Boolean
        }
      }
      const value = {
        id: 1,
        attrs: {
          name: 'John Doe',
          isActive: 0
        }
      }
      expect(diff(description, value)).to.deep.equal({
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
      const description = {
        id: Number,
        attrs: {
          name: String,
          isActive: Boolean
        }
      }
      const value = {
        id: 1,
        attrs: {
          name: 'John Doe',
          isActive: true,
          isHandsome: true
        }
      }
      expect(diff(description, value)).to.deep.equal({
        attrs: {
          isHandsome: {
            unexpected: 'Boolean',
            value: true
          }
        }
      })
    })

  })

  context('complex objects', () => {

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
      expect(diff(Owner, owner)).to.equal(null)
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
          0: {
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
          1: {
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

  })

  describe('nested primitive literals', () => {

    it('diffs all correct nested properties', () => {
      const description = {
        id: 1,
        attrs: {
          name: 'John Doe',
          isActive: true
        }
      }
      const value = {
        id: 1,
        attrs: {
          name: 'John Doe',
          isActive: true
        }
      }
      expect(diff(description, value)).to.equal(null)
    })

    it('diffs incorrect nested properties', () => {
      const description = {
        id: 1,
        attrs: {
          name: 'John Doe',
          isActive: true
        }
      }
      const value = {
        id: 'one',
        attrs: {
          name: 'Joe King',
          isActive: false
        }
      }
      expect(diff(description, value)).to.deep.equal({
        id: {
          actual: 'one',
          expected: 1
        },
        attrs: {
          name: {
            actual: 'Joe King',
            expected: 'John Doe'
          },
          isActive: {
            actual: false,
            expected: true
          }
        }
      })
    })

  })

})
