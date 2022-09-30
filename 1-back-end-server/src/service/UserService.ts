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
    return await this.composeAuthResult(user)
  }

  /**
   * { 인증토큰, User }
   */
  private async composeAuthResult(user: User) {
    const token = await this.getAuthToken(user)
    return { token, user }
  }

  private async getAuthToken(userId: number, username: string) {
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

    return { accessToken, refreshToken }
  }

  async login({ username, password }: Authentication) {
    return 'logged in!'
  }
}

export default UserService
