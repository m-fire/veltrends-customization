import * as brcypt from 'bcrypt'
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
    const passwordHash = await brcypt.hash(password, SOLT_ROUNDS)
    const user = await this.userRepository.save(username, passwordHash)
    // 인증토큰
    const token = await this.getAuthToken(user.id, username)

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
