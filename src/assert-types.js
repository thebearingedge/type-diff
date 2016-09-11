import assert from 'assert'
import diff from './diff'

export default function assertTypes(Type, value) {

  const result = diff(Type, value)

  if (result) {
    const paths = JSON.stringify(result, null, 2)
    assert(!result, `Incorrect Type structure: ${paths}`)
  }
}
