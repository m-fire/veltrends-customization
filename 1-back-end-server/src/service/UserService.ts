import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { Authentication } from '../routes/api/auth/types.js'
import AppError from '../common/error/AppError.js'
import UserRepository from '../repository/UserRepository.js'
import TokenRepository from '../repository/TokenRepository.js'
import {
  generateToken,
  RefreshTokenPayload,
  validateToken,
} from '../common/config/jwt/tokens.js'

const SOLT_ROUNDS = 10

class UserService {
  private userRepository = UserRepository.getInstance()
  private tokenRepository = TokenRepository.getInstance()

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

  async refreshToken(oldToken: string) {
    try {
      const decoded = await validateToken<RefreshTokenPayload>(oldToken)
    } catch (e) {
      throw new AppError('RefreshTokenError')
    }
  }

  /**
   * { 인증토큰, User }
   */
  private async composeTokenAndUser(user: User) {
    const { id: userId, username } = user
    const token = await this.tokenRepository.save(userId)

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access',
        tokenId: token.id,
        userId,
        username,
      }),
      generateToken({
        type: 'refresh',
        tokenId: token.id,
        rotationCounter: 1,
      }),
    ])
    const tokens = { accessToken, refreshToken }

    return { tokens, user }
  }

  /**
   * 사용자를 못찾거나 PW가 틀릴경우, 보안상 모두 동일한 `AuthenticationError` 발생시킨다.
   */
  async login({ username, password }: Authentication) {
    const user = await this.userRepository.findUnique(username)
    // Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
    try {
      // 로그인 정보 검증
      // 1. 가입된 사용자가 없으면  애러처리
      // 2. PW가 일치하지 않으면 애러처리
      if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        throw new AppError('AuthenticationError')
    } catch (e) {
      // AppError 일 경우, 그대로 re-throw
      if (AppError.equals(e)) throw e
      // 알수없는 애러
      throw new AppError('UnknownError')
    }
    return await this.composeTokenAndUser(user)
  }

  private validateAuthentication() {
    console.log(validateToken)
  }
}

export default UserService
