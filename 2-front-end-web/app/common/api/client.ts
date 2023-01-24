import axios from 'axios'

export type RoutePath =
  | '/'
  | '/auth/login'
  | '/auth/register'
  | '/search'
  | '/write'
  | '/bookmarks'
  | '/setting'

export const client = axios.create()

client.defaults.baseURL = 'http://localhost:4000'
client.defaults.withCredentials = true

export class Clients {
  static setCookie(cookie: string) {
    client.defaults.headers.common['Cookie'] = cookie
  }
}

/* Remix 가 쿠키 제거 알아서 처리하므로 불필요 */
// export function clearClientCookie() {
//   delete client.defaults.headers.common['Cookie']
// }
