import { AxiosResponse } from 'axios'
import { client, Clients, URL_API_SERVER } from '~/common/api/client'
import { isString } from '~/common/util/strings'
import { AuthUser } from '~/common/api/types'

// Constants

// parent uris
const API = URL_API_SERVER + '/api'
const API_AUTH = API + '/auth'
// children entries
const URL_ME = API + '/me'
const URL_REGISTER = API_AUTH + '/register'
const URL_LOGIN = API_AUTH + '/login'
const URL_LOGOUT = API_AUTH + '/logout'

export class Authenticator {
  static async createAuthentication(params: CreateAuthParams) {
    const response = await client.post<AuthResult>(URL_REGISTER, params)
    console.log(`register.register() response:`, response)
    const headers = Cookies.createHeaders(response.headers)
    return { headers, result: response.data }
  }

  static async getUser() {
    const response = await client.get<AuthUser>(URL_ME)
    if (!response.data) return null
    return response.data
  }

  static async getAuthentication(params: GetAuthenticationParam) {
    const response = await client.post<AuthResult>(URL_LOGIN, params)
    const headers = Cookies.createHeaders(response.headers)
    return { headers, result: response.data }
  }

  static async isAuthenticated(request: Request) {
    const cookie = request.headers.get('Cookie')
    if (!cookie || !cookie.includes('access_token')) return false

    Clients.setCookie(cookie)
    try {
      const user = await Authenticator.getUser()
      if (!user) return false
    } catch (e) {
      console.log({ e })
      return false
    }

    return true
  }

  static async removeAuthentication() {
    await client.post<AuthResult>(URL_LOGOUT)
  }
}

export class Cookies {
  static createHeaders(responseHeaders: AxiosResponse['headers']) {
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
}

export interface AuthResult {
  tokens: Tokens
  user: AuthUser
}

interface CreateAuthParams {
  username: string
  password: string
}

type GetAuthenticationParam = CreateAuthParams

interface Tokens {
  accessToken: string
  refreshToken: string
}
