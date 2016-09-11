import assert from 'assert'
import diff from './diff'

export default function assertTypes(Type, obj) {

  const difference = diff(Type, obj)

  if (difference) {
    const paths = JSON.stringify(difference, null, 2)
    assert(!difference, `Interface not as expected:\n${paths}`)
  }
}
