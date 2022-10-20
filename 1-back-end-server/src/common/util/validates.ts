import AppError from '../error/AppError'
import { client } from '../config/axios/client'

export class Validator {
  static URL = class ExternalUrlValidator {
    static hasProtocol(url: string) {
      return /^https?:\/\//.test(url)
    }
  }
}
