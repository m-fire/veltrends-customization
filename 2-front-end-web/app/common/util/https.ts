export class Requests {
  static parseUrlParams<T>(url: string) {
    const paramsMap = new URLSearchParams(new URL(url).searchParams)
    const result = {} as any
    for (const [k, v] of paramsMap) {
      result[k] = v
    }
    return result as T
  }
}
