export type BuiltinObjects =
  // | Object
  // | Array<any>
  // | Function
  | Error
  | EvalError
  | RangeError
  | ReferenceError
  | SyntaxError
  | TypeError
  | URIError
  | ArrayBuffer
  | Boolean
  | DataView
  | Date
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Map<any, any>
  | Number
  | Promise<any>
  | RegExp
  | Set<any>
  | String
  | Symbol
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | WeakMap<any, any>
  | WeakSet<any>
  | JSON
  | Math
//| Global
//| Iterator
//| Generator
//| GeneratorFunction
//| AsyncGenerator
//| AsyncGeneratorFunction

/**
 * <h3>T 의 (key:value) 중 `value 타입`에 해당하는 keys 로 타입선언</h3>
 * <p>ex: type MouseEventType = ExtractKey〈GlobalEventHandlersEventMap, MouseEvent〉</p>
 * @author mfire
 */
export type ExtractKey<T, K> = {
  [P in keyof T]: T[P] extends K ? P : never
}[keyof T]

/**
 * <h3>T 의 모든 속성을 '?'optional 속성으로 변경</h3>
 */
export type Optional<T> = { [P in keyof T]?: T[P] }
/**
 * <h3>재귀적으로 T 와 포함된 T의 모든 속성들을 '?'optional 로 변경</h3>
 */
export type OptionalDeep<T> = { [P in keyof T]?: OptionalDeep<T[P]> }

/**
 * <h3>T의 속성들을 'non-readonly' 로 변경</h3>
 */
export type NonReadonly<T> = { -readonly [P in keyof T]: T[P] }
/**
 * <h3>재귀적으로 T 와 포함된 T의 모든 속성들을 'non-readonly' 로 변경</h3>
 */
export type NonReadonlyDeep<T> = {
  -readonly [P in keyof T]: NonReadonlyDeep<T[P]>
}

export type ChangeProperties<T, P, U> = {
  [K in keyof T]: T[K] extends P | null | undefined
    ? U | Extract<T[K], null | undefined>
    : T[K]
}

export type IterableElement<C extends Iterable<any>> = C extends Iterable<
  infer C
>
  ? C
  : never

export type IsArray<T> = T extends any[] | null | undefined ? true : never
