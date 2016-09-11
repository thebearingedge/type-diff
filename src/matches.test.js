import { describe, it } from 'global'
import { expect } from 'chai'
import matches from './matches'

describe('matches(Type, obj)', () => {

  it('knows whether an Array populated with Objects matches a Type', () => {
    const Type = [{ name: String, birthday: Date }]
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
    expect(matches(Type, obj)).to.be.true
  })

  it('knows whether a complex object matches a Type', () => {
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
      pets: [garfield, odie, 1]
    }
    expect(matches(Owner, john)).to.be.false
  })

})
