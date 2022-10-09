import axios, { AxiosResponse } from 'axios'

const URL_SERVER = 'http://localhost:4000'
const URI_API_AUTH = '/api/auth'

export async function register(params: AuthParams) {
  const response = await axios.post<AuthResult>(
    `${URL_SERVER + URI_API_AUTH}/register`,
    params,
  )
  const headers = createCookieHeaders(response.headers)
  return { headers, result: response.data }
}

export async function login(params: AuthParams) {
  const response = await axios.post<AuthResult>(
    `${URL_SERVER + URI_API_AUTH}/login`,
    params,
  )
  const headers = createCookieHeaders(response.headers)
  return { headers, result: response.data }
}

function createCookieHeaders<T>(responseHeaders: AxiosResponse<T>['headers']) {
  /*Axios headers['set-cookie'] 타입 불일치: 배열이 아니라 string 을 반환한다. 때문에 강제 string 형 변환 */
  const cookieString = responseHeaders['set-cookie'] as string | undefined
  if (!cookieString?.length) {
    throw new Error('No cookie string')
  }
  const headers = new Headers()
  headers.append('Set-Cookie', cookieString)
  return headers
}

interface AuthParams {
  username: string
  password: string
}

interface AuthResult {
  tokens: Tokens
  user: User
}

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface User {
  id: number
  username: string
}
