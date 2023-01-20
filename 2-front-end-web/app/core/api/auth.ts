import { AxiosResponse } from 'axios'
import { client, Clients, URL_API_SERVER } from '~/common/api/client'
import { isString } from '~/common/util/strings'
import { SimpleUser } from '~/common/api/types'

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
  private static authorizedAccountMemo: AuthResult | null = null

  static async getAccount() {
    const response = await client.get<AuthResult>(URL_ME)
    if (!Authenticator.authorizedAccountMemo)
      Authenticator.authorizedAccountMemo = response.data

    return Authenticator.authorizedAccountMemo
  }

  static async checkAuthenticated(request: Request) {
    const cookie = request.headers.get('Cookie')
    if (!cookie || !cookie.includes('access_token')) return false

    Clients.setCookie(cookie)
    try {
      await Authenticator.getAccount()
    } catch (e) {
      console.log({ e })
      return false
    }

    return true
  }

  static Route = class RouteAccessAuthenticator {
    static async register(params: AuthParams) {
      const response = await client.post<AuthResult>(URL_REGISTER, params)
      console.log(`register.register() response:`, response)
      const headers = Cookies.createHeaders(response.headers)
      return { headers, result: response.data }
    }

    static async login(params: AuthParams) {
      const response = await client.post<AuthResult>(URL_LOGIN, params)
      const headers = Cookies.createHeaders(response.headers)
      return { headers, result: response.data }
    }
  }

  static async logout() {
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
  user: SimpleUser
}

interface AuthParams {
  username: string
  password: string
}

interface Tokens {
  accessToken: string
  refreshToken: string
}
