import { describe, it } from 'global'
import { expect } from 'chai'
import matches from './matches'

describe('matches(Type, value)', () => {

  it('knows whether an Array populated with Objects matches a Type', () => {
    const Type = [{ name: String, birthday: Date }]
    const arr = [
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
    expect(matches(Type, arr)).to.be.true
  })

  it('knows whether a complex Object matches a Type', () => {
    const Owner = { name: String, pets: [{ name: String, weight: Number }] }
    const owner = {
      name: 'John Arbuckle',
      pets: [
        { name: 'Garfield', weight: 40 },
        { name: 'Odie', weight: 17 },
        1
      ]
    }
    expect(matches(Owner, owner)).to.be.false
  })

})
