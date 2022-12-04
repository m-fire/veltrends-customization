import { AuthUserInfo } from '../../routes/api/auth/types.js'
import AppError from '../error/AppError.js'

export class Validator {
  static Auth = class AuthenticationValidator {
    static getValidUser(user: AuthUserInfo | null): AuthUserInfo {
      if (user == null || user?.id == null) throw new AppError('Forbidden')
      return user
    }
  }
  static URL = class ExternalUrlValidator {
    static hasProtocol(url: string) {
      return /^https?:\/\//.test(url)
    }
  }
}
