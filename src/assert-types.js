import assert from 'assert'
import matches from './matches'
import diff from './diff'


export default function assertTypes(Shape, obj) {

  const isMatch = matches(Shape, obj)

  if (!isMatch) {
    const paths = JSON.stringify(diff(Shape, obj), null, 2)
    assert(isMatch, `Interface not as expected:\n${paths}`)
  }
}
