import { client, URL_API_SERVER } from '~/common/api/client'
import { UserInfo } from '~/common/api/types'

const API = URL_API_SERVER + '/api'
const URL_ME = API + '/me'

export class UserInformation {
  static async getUserInfo() {
    const response = await client.get<UserInfo>(URL_ME)
    if (!response.data) return null
    return response.data
  }
}
