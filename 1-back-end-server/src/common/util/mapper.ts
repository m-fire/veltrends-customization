export class Mapper {
  // /**
  //  * <h2>속성 매핑(얕은 or 깊은검색 선택)</h2>
  //  * 오브젝트 또는 배열안에 특정 타입의 모든속성 및 배열요소들을
  //  * deep 매개변수를 통해 얕은 또는 깊은(재귀) 탐색 후,
  //  * mapper 매개변수 의 반환타입으로 매핑 된 T타입 객체가 반환된다.
  //  * @param o Record<K, T[K]>
  //  * @param type 변경할 속성의 타입
  //  * @param mapper 해당 속성|요소 를 바꿀 매퍼함수. 첫째 인자로 이전 값이 전달된다.
  //  * @param deep 얕은검색(lv 0) 또는 재귀적 검색(lv N)
  //  */
  static mapProps<T, K extends keyof T, Prev, Next, Deep extends boolean>(
    o: T,
    type: new (...args: any[]) => Prev,
    mapper: (prev: Prev) => Next,
    deep?: Deep,
  ) {
    const result: any = Array.isArray(o) ? [] : {}

    for (const k in o) {
      const prop = o[k]
      if (prop instanceof type) {
        result[k] = mapper(prop as Prev)
      } else if (Array.isArray(prop) || prop?.constructor === Object) {
        result[k] = deep ? this.mapProps(prop, type, mapper, true) : prop
      } else {
        result[k] = prop
      }
    }
    return result as PropsMapping<T, Prev, Next, Deep>
  }
}

type PropsMapping<T, Prev, Next, Recursive extends boolean = false> = {
  [P in keyof T]: T[P] extends Prev | null | undefined
    ? Next | Extract<T[P], null | undefined>
    : T[P] extends Record<string, any> | any[]
    ? Recursive extends true
      ? PropsMapping<T[P], Prev, Next, Recursive>
      : T[P]
    : T[P]
}
