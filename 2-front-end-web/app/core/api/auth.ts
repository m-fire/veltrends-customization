import { AxiosResponse } from 'axios'
import { client, Clients } from '~/common/api/client'
import { isString } from '~/common/util/strings'
import { Account } from '~/common/api/types'
import { Me } from '~/core/api/me'

// Constants

const URL_REGISTER = '/api/auth/register' as const
const URL_REFRESH = '/api/auth/refresh' as const
const URL_LOGIN = '/api/auth/login' as const
const URL_LOGOUT = '/api/auth/logout' as const

export class Authenticator {
  static async createAuthentication(params: CreateAuthParams) {
    const response = await client.post<AuthResult>(URL_REGISTER, params)
    console.log(`register.register() response:`, response)
    const headers = Cookies.createHeaders(response.headers)
    return { headers, result: response.data }
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
      const user = await Me.getAccount()
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

  static async refreshToken() {
    const response = await client.post<Tokens>(URL_REFRESH, {})

    const tokens = response.data
    const headers = Cookies.createHeaders(response.headers)

    return { headers, tokens }
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
  user: Account
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
