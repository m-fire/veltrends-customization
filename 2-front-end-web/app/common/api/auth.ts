import axios, { AxiosResponse } from 'axios'
import { URL_API_SERVER, client } from '~/common/api/client'
import { isString } from '~/common/util/strings'

// Constants

// parent uris
const API = URL_API_SERVER + '/api'
const API_AUTH = API + '/auth'
// children entries
const URL_ME = API + '/me'
const URL_REGISTER = API_AUTH + '/register'
const URL_LOGIN = API_AUTH + '/login'

// API functions

export async function register(params: AuthParams) {
  const response = await client.post<AuthResult>(URL_REGISTER, params)
  console.log(`register.register() response:`, response)
  const headers = createCookieHeaders(response.headers)
  return { headers, result: response.data }
}

export async function login(params: AuthParams) {
  const response = await client.post<AuthResult>(URL_LOGIN, params)
  const headers = createCookieHeaders(response.headers)
  return { headers, result: response.data }
}

export async function getMe() {
  const response = await client.get<User>(URL_ME)
  const headers = createCookieHeaders(response.headers)
  return { headers, result: response.data }
}

function createCookieHeaders(responseHeaders: AxiosResponse['headers']) {
  /*Axios headers['set-cookie'] 타입 불일치: 배열이 아니라 string 을 반환한다. 때문에 강제 string 형 변환 */
  const cookieArrayOrString = responseHeaders['set-cookie']
  if (cookieArrayOrString?.length === 0) throw new Error('No cookie string')

  const headers = new Headers()
  if (isString(cookieArrayOrString)) {
    // cookieArrayOrString
    //   .split(';')
    //   .forEach((cookie) => headers.append('Set-Cookie', cookie))
    headers.append('Set-Cookie', cookieArrayOrString)
  } else if (Array.isArray(cookieArrayOrString)) {
    cookieArrayOrString.forEach((cookie) =>
      headers.append('Set-Cookie', cookie),
    )
  }
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

export interface User {
  id: number
  username: string
}
