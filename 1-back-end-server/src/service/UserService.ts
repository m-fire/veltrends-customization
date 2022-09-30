import * as brcypt from 'bcrypt'
import { Authentication } from '../routes/api/auth/types.js'
import db from '../common/config/prisma/db-client.js'
import AppError from '../common/error/AppError.js'
import { randomUUID } from 'crypto'
import * as authTokens from '../common/config/jwt/tokens.js'

const SOLT_ROUNDS = 10

class UserService {
  private static instance: UserService

  private constructor() {}

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async register({ username, password }: Authentication) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    })
    if (exists) throw new AppError('UserExistsError')

    // 패스워드 암호화 및 사용자저장
    const passwordHash = await brcypt.hash(password, SOLT_ROUNDS)
    const user = await db.user.create({
      data: {
        username: `${username}-${randomUUID().substring(0, 2)}`,
        passwordHash,
      },
    })

    // 인증토큰
    const token = await this.getAuthToken(user.id, username)

    return { token, user }
  }

  async getAuthToken(userId: number, username: string) {
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
