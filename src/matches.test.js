import { describe, it } from 'global'
import { expect } from 'chai'
import matches from '../src/matches'

describe('matches(Shape, obj)', () => {

  it('knows if an object matches a shallow Shape', () => {
    const Shape = { name: String }
    const obj = { name: 'John Doe' }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows if an object does not have a shallow Shape', () => {
    const Shape = { id: Number }
    const obj = { id: null }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })

  it('knows if an object has a shallow Shape with nested Objects', () => {
    const Shape = {
      id: Number,
      attrs: Object
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: true
      }
    }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows if an object has a shallow Shape missing child Objects', () => {
    const Shape = {
      id: Number,
      attrs: Object
    }
    const obj = {
      id: 1,
      attrs: null
    }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })

  it('knows if an object matches a nested Shape', () => {
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
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows if an object does not match a nested Shape', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: String,
        isActive: Boolean,
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: null
      }
    }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })


  it('knows if an object matches a deeply nested Shape', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: {
          first: String,
          last: String
        },
        isActive: Boolean,
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: {
          first: 'John',
          last: 'Doe'
        },
        isActive: true
      }
    }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows if an object does not match a deeply nested Shape', () => {
    const Shape = {
      id: Number,
      attrs: {
        name: {
          first: String,
          last: String
        },
        isActive: Boolean,
      }
    }
    const obj = {
      id: 1,
      attrs: {
        name: 'John Doe',
        isActive: true
      }
    }
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })

  it('knows if an empty Array matches a Shape', () => {
    const Shape = Array
    const obj = []
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows if a non-Array does not match a Shape', () => {
    const Shape = Array
    const obj = null
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })

  it('knows if a populated Array matches a Shape', () => {
    const Shape = [String]
    const obj = ['foo', 'bar', 'baz']
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows if a populated Array does not match a Shape', () => {
    const Shape = [String]
    const obj = [1, 2, 3]
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })

  it('knows that a mixed Array does not match a Shape', () => {
    const Shape = [Boolean]
    const obj = [true, false, null]
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.false
  })

  it('knows whether an Array populated with Objects matches a Shape', () => {
    const Shape = [{ name: String, birthday: Date }]
    const obj = [
      {
        name: 'Dennis Ritchie',
        birthday: new Date('September 9, 1941')
      },
      {
        name: 'Bjarne Stroustrup',
        birthday: new Date('December 30, 1950')
      },
      {
        name: 'Anders Hejlsberg',
        birthday: new Date('December 1960')
      }
    ]
    const isMatch = matches(Shape, obj)
    expect(isMatch).to.be.true
  })

  it('knows whether a complex object matches a Shape', () => {
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
    const isMatch = matches(Owner, john)
    expect(isMatch).to.be.true
  })

})
