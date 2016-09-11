import diff from './diff'

export default function matches(Type, value) {
  return !diff(Type, value)
}
