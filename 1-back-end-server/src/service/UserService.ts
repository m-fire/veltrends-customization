import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import { UserAuthInfo } from '../routes/api/auth/types.js'
import AppError from '../common/error/AppError.js'
import TokenService, { TokenStringMap } from './TokenService.js'

const SOLT_ROUNDS = 10

class UserService {
  private tokenService = TokenService.getInstance()

  private constructor() {}

  private static instance: UserService

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async register({
    username,
    password,
  }: UserAuthInfo): Promise<AuthTokensAndUser> {
    const exists = await db.user.findUnique({ where: { username } })
    if (exists) throw new AppError('UserExistsError')

    // 패스워드 암호화 및 사용자 저장
    try {
      // Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
      const passwordHash = await bcrypt.hash(password, SOLT_ROUNDS)
      const newUser = await db.user.create({ data: { username, passwordHash } })
      const tokens = await this.tokenService.generateTokens(newUser)

      // console.log(`UserService.register() newUser, tokens:`, newUser, tokens)
      return { tokens, user: newUser }
    } catch (e) {
      throw new AppError('UnknownError')
    }
  }

  /**
   * 사용자를 못찾거나 PW가 틀릴경우, 보안상 모두 동일한 `AuthenticationError` 발생시킨다.
   */
  async login({
    username,
    password,
  }: UserAuthInfo): Promise<AuthTokensAndUser> {
    const existsUser = await db.user.findUnique({ where: { username } })
    // Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
    try {
      // 1:가입된 사용자가 없거나 2:PW가 일치하지 않으면 애러
      if (
        !existsUser ||
        !(await bcrypt.compare(password, existsUser.passwordHash))
      )
        throw new AppError('AuthenticationError')

      const tokens = await this.tokenService.generateTokens(existsUser)
      // console.log(`UserService.login() existsUser, tokens:`, existsUser, tokens)
      return { tokens, user: existsUser }
    } catch (e) {
      // AppError 일 경우, 그대로 re-throw
      if (AppError.equals(e)) throw e
      // 알수없는 애러
      throw new AppError('UnknownError')
    }
  }

  async refreshToken(oldToken: string): Promise<TokenStringMap> {
    try {
      const ts = this.tokenService
      const { tokenId: refreshTokenId } = await ts.validateRefreshToken(
        oldToken,
      )
      const tokenEntity = await ts.getTokenWithUser(refreshTokenId)

      /* Security settings */
      if (!tokenEntity) throw new Error('Token not found')
      if (tokenEntity.blocked) throw new Error('Token is blocked')

      const tokens = await ts.generateTokens(tokenEntity.user, tokenEntity)
      // console.log(`UserService.refreshToken() tokens:`, tokens)
      return tokens
    } catch (e) {
      throw new AppError('RefreshTokenError')
    }
  }
}
export default UserService

type AuthTokensAndUser = { tokens: TokenStringMap; user: User }
