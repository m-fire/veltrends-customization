import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import AppError from '../common/error/AppError.js'
import TokenService, { TokenStringMap } from './TokenService.js'
import { AuthBody, AuthUserInfo } from '../routes/api/auth/types.js'

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

  async register({ username, password }: AuthBody): Promise<TokensAndUser> {
    const exists = await db.user.findUnique({ where: { username } })
    if (exists) throw new AppError('UserExists')

    // 패스워드 암호화 및 사용자 저장
    try {
      // Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
      const passwordHash = await bcrypt.hash(password, SOLT_ROUNDS)
      const newUser = await db.user.create({ data: { username, passwordHash } })
      const tokens = await this.tokenService.generateTokens(newUser)

      // console.log(`UserService.register() newUser, tokens:`, newUser, tokens)
      return { tokens, user: newUser }
    } catch (e) {
      throw new AppError('Unknown')
    }
  }

  /**
   * 사용자를 못찾거나 PW가 틀릴경우, 보안상 모두 동일한 `AuthenticationError` 발생시킨다.
   */
  async login({ username, password }: AuthBody): Promise<TokensAndUser> {
    const existsUser = await db.user.findUnique({ where: { username } })
    // Promise 는 어떤 애러가 발생할지 알 수 없기에, try catch 처리
    try {
      // 1:가입된 사용자가 없거나 2:PW가 일치하지 않으면 애러
      if (
        !existsUser ||
        !(await bcrypt.compare(password, existsUser.passwordHash))
      )
        throw new AppError('Authentication')

      const tokens = await this.tokenService.generateTokens(existsUser)
      // console.log(`UserService.login() existsUser, tokens:`, existsUser, tokens)
      return { tokens, user: existsUser }
    } catch (e) {
      // AppError 일 경우, 그대로 re-throw
      if (AppError.equals(e)) throw e
      // 알수없는 애러
      throw new AppError('Unknown')
    }
  }

  async refreshToken(oldToken: string): Promise<TokenStringMap> {
    try {
      const ts = this.tokenService
      const { tokenId: id, rotationCounter: outCount } =
        await ts.validateRefreshToken(oldToken)
      const tokenWithUser = await ts.getTokenWithUser(id)

      if (!tokenWithUser) throw new Error('Token not found')
      if (tokenWithUser.blocked) throw new Error('Token is blocked')

      /* Outer n Inner refreshed count validation(with rotationCounter) */

      // 토큰갱신횟수가 일치하지 않으면, 이상접근으로 blocked 처리
      const { rotationCounter: inCount } = tokenWithUser
      if (inCount !== outCount) {
        await db.token.update({ where: { id }, data: { blocked: true } })
        throw new Error('Rotation counter does not match.')
      }
      // 유효토큰인 경우, DB Token.rotationCounter 증가 반영
      const updated = await db.token.update({
        where: { id },
        data: { rotationCounter: inCount + 1 },
      })

      const refreshedTokens = await ts.generateTokens(
        tokenWithUser.user,
        updated,
      )
      // console.log(`UserService.refreshToken() refreshedTokens:`, refreshedTokens)
      return refreshedTokens
    } catch (e) {
      throw new AppError('RefreshFailure')
    }
  }
}
export default UserService

type TokensAndUser = { tokens: TokenStringMap; user: AuthUserInfo }
