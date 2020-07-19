type Primitive =
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined

export type BuiltIn =
  | ArrayConstructor
  | BigIntConstructor
  | BooleanConstructor
  | DateConstructor
  | FunctionConstructor
  | NumberConstructor
  | ObjectConstructor
  | StringConstructor
  | SymbolConstructor

export type Description =
  | typeof Any
  | BuiltIn
  | Primitive
  | Nullable<Description>
  | Optional<Description>
  | { new(): any }
  | { (...args: any[]): any }
  | { [key: string]: any }
  | [any]

export class Nullable<D extends Description> {

  constructor(public description: D) {}

  is(value: any): boolean {
    return value === null
  }

}

export class Optional<D extends Description> {

  constructor(public description: D) {}

  is(value: any): boolean {
    return typeof value === 'undefined'
  }

}

export const Any = (function Any(): typeof Any {
  return Any
})()

export function OptionalConstructor<D extends Description>(description: D): Optional<D> {
  return new Optional(description)
}

export function NullableConstructor<D extends Description>(description: D): Nullable<D> {
  return new Nullable(description)
}
