import { client, Clients } from '~/common/api/client'
import { Account } from '~/common/api/types'
import AppError from '~/common/error/AppError'
import { Authenticator } from '~/core/api/auth'

const URL_ME = '/api/me' as const
const URL_ME_CHANGE_PASSWORD = '/api/me/change-password' as const

export class Me {
  static async getAccount(accessToken?: string) {
    const response = await client.get<Account>(URL_ME, {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    })
    if (!response.data) return null
    return response.data
  }

  private static accountMemo: Promise<{
    account: Account | null
    headers: Headers | null
  }> | null = null

  static async getAccountMemo() {
    if (!Me.accountMemo) {
      Me.accountMemo = Me.getAccountWithRefresh()
    }
    return Me.accountMemo
  }

  private static async getAccountWithRefresh() {
    try {
      const account = await Me.getAccount()

      return { account, headers: null }
    } catch (e) {
      const error = AppError.of(e)
      if (
        error.name === 'Unauthorized' &&
        (error as AppError<'Unauthorized'>).payload?.isExpiredToken
      ) {
        try {
          const account = await Me.getAccount()
          const { tokens, headers } = await Authenticator.refreshToken()

          Clients.setCookie(`access_token=${tokens.accessToken}`)

          return { account, headers }
        } catch (innerError) {
          throw e
        }
      }
      throw e
    }
  }

  static async changePassword(params: {
    oldPassword: string
    newPassword: string
  }) {
    const response = await client.post<Account>(URL_ME_CHANGE_PASSWORD, params)
    if (!response.data) return null
    return response.data
  }

  static async unregister() {
    const response = await client.delete(URL_ME)
    return response.data
  }
}

const unauthorizedData = { authUser: null, cookie: null }
