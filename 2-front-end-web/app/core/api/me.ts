import { client } from '~/common/api/client'
import { UserInfo } from '~/common/api/types'

const URL_ME = '/api/me' as const

export class UserInformation {
  static async getUserInfo() {
    const response = await client.get<UserInfo>(URL_ME)
    if (!response.data) return null
    return response.data
  }
}
