import diff from './diff'


export default function matches(Shape, value) {
  return !diff(Shape, value)
}
