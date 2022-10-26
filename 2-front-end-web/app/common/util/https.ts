export class Requests {
  static parseUrlParams<T>(url: string) {
    const paramsMap = new URLSearchParams(url)
    const result = {} as any
    for (const [k, v] of paramsMap) {
      result[k] = v
    }
    return result as T
  }
}
