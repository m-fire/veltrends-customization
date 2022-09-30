import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { Authentication } from '../routes/api/auth/types.js'
import AppError from '../common/error/AppError.js'
import * as authTokens from '../common/config/jwt/tokens.js'
import UserRepository from './UserRepository.js'

const SOLT_ROUNDS = 10

class UserService {
  private userRepository = UserRepository.getInstance()

  private constructor() {}

  private static instance: UserService

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async register({ username, password }: Authentication) {
    const exists = await this.userRepository.findUnique(username)
    if (exists) throw new AppError('UserExistsError')

    // 패스워드 암호화 및 사용자저장

    let passwordHash
    try {
      // Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
      passwordHash = await bcrypt.hash(password, SOLT_ROUNDS)
    } catch (e) {
      throw new AppError('UnknownError')
    }

    const user = await this.userRepository.save(username, passwordHash)
    return await this.composeTokenAndUser(user)
  }

  /**
   * { 인증토큰, User }
   */
  private async composeTokenAndUser(user: User) {
    const { id: userId, username } = user

    const [accessToken, refreshToken] = await Promise.all([
      authTokens.generateToken({
        type: 'access',
        tokenId: 1,
        userId,
        username,
      }),
      authTokens.generateToken({
        type: 'refresh',
        tokenId: 1,
        rotationCounter: 1,
      }),
    ])
    const token = { accessToken, refreshToken }

    return { token, user }
  }

  /**
   * 사용자를 못찾거나 비번이 틀릴경우, 보안상 모두 동일한 `AuthenticationError` 발생시킨다.
   */
  async login({ username, password }: Authentication) {
    const user = await this.userRepository.findUnique(username)
    try {
      // 1. 가입된 사용자가 없으면 보안상 가입여부를 알리지 않기위해 패스워드 오류처리
      // 2. Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
      if (!user || (await bcrypt.compare(password, user.passwordHash)))
        throw new AppError('AuthenticationError')
    } catch (e) {
      // AppError 일 경우, 그대로 re-throw
      if (AppError.is(e)) throw e
      // 알수없는 애러
      throw new AppError('UnknownError')
    }
    return await this.composeTokenAndUser(user)
  }

  private validateAuthentication() {
    console.log(authTokens.validateToken)
  }
}

export default UserService
