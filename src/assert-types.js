import assert from 'assert'
import diff from './diff'


export default function assertTypes(Shape, obj) {

  const difference = diff(Shape, obj)

  if (difference) {
    const paths = JSON.stringify(difference, null, 2)
    assert(!difference, `Interface not as expected:\n${paths}`)
  }
}
