import { client } from '~/common/api/client'
import { UserInfo } from '~/common/api/types'

const URL_ME = '/api/me' as const
const URL_ME_CHANGE_PASSWORD = '/api/me/change-password' as const

export class UserInformation {
  static async getUserInfo() {
    const response = await client.get<UserInfo>(URL_ME)
    if (!response.data) return null
    return response.data
  }

  static async changePassword(params: {
    oldPassword: string
    newPassword: string
  }) {
    const response = await client.post<UserInfo>(URL_ME_CHANGE_PASSWORD, params)
    if (!response.data) return null
    return response.data
  }

  static async unregister() {
    const response = await client.delete(URL_ME)
    return response.data
  }
}
