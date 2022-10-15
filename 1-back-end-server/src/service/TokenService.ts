import { User, Token } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import {
  generateToken,
  RefreshTokenPayload,
  validateToken,
} from '../common/config/jwt/tokens.js'

export default class TokenService {
  private static instance: TokenService

  private constructor() {}

  static getInstance() {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }
    return TokenService.instance
  }

  async generateTokens(user: User, token?: Token): Promise<TokenStringMap> {
    const { id: userId, username } = user
    const { id: tokenId, rotationCounter } =
      token ?? (await db.token.create({ data: { userId } }))

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access',
        tokenId,
        userId,
        username,
      }),
      generateToken({
        type: 'refresh',
        tokenId,
        rotationCounter,
      }),
    ])
    return { accessToken, refreshToken }
  }

  async getTokenWithUser(tokenId: number) {
    return db.token.findUnique({
      where: { id: tokenId },
      include: { User: true },
    })
  }

  async validateRefreshToken(tokenStr: string) {
    return validateToken<RefreshTokenPayload>(tokenStr)
  }
}

export interface TokenStringMap {
  accessToken: string
  refreshToken: string
}
