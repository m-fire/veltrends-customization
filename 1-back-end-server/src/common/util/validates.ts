import AppError from '../error/AppError.js'
import { AuthResponseCodeMap } from '../../routes/api/auth/types'

export class Validator {
  static Auth = class AuthenticationValidator {
    static getValidUser(user: AuthUserInfo | null): AuthUserInfo {
      if (user == null || user?.id == null) throw new AppError('Forbidden')
      return user
    }
    /**
     * should be more than or equal to 8 letters and contains at least two types of alphabet, number, special character.
     * 8자 이상이어야 하며 알파벳, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.
     */
    static isValidPassword(password: string) {
      const passwordRules = [/[a-zA-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
      if (password.length < 8) return false
      const counter = passwordRules.reduce((acc, current) => {
        if (current.test(password)) {
          acc += 1
        }
        return acc
      }, 0)
      return counter > 1
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

type AuthUserInfo = AuthResponseCodeMap['LOGIN']['200']['user']
