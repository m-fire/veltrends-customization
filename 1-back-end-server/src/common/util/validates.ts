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
  static DateFormat = class DateFormatValidator {
    /**
     * yyyy-mm-dd 형태의 날짜형식 문자열을 검사합니다.
     */
    static yyyymmdd(date: string) {
      return !/^\d{4}-\d{2}-\d{2}$/.test(date)
    }
  }
}
