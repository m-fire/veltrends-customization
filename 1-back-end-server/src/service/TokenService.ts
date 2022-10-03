import { User } from '@prisma/client'
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

  async generateTokens(user: User, oldTokenId?: number): Promise<AuthTokens> {
    const { id: userId, username } = user
    const tokenId =
      oldTokenId ?? (await db.token.create({ data: { userId } })).id

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
        rotationCounter: 1,
      }),
    ])
    return { accessToken, refreshToken }
  }

  async getTokenWithUser(tokenId: number) {
    return db.token.findUnique({
      where: { id: tokenId },
      include: { user: true },
    })
  }

  async validateRefreshToken(tokenStr: string) {
    return validateToken<RefreshTokenPayload>(tokenStr)
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}
