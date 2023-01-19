import { Token } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import {
  generateToken,
  RefreshTokenPayload,
  TokenStringMap,
  validateToken,
} from '../common/config/jwt/tokens.js'
import { AuthUserInfo } from '../routes/api/auth/types.js'

export default class TokenService {
  static async generateTokens(
    { id: userId, username }: AuthUserInfo,
    token?: Token,
  ): Promise<TokenStringMap> {
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

  static async getTokenWithUser(tokenId: number) {
    return db.token.findUnique({
      where: { id: tokenId },
      include: { user: { select: { id: true, username: true } } },
    })
  }

  static async validateRefreshToken(tokenStr: string) {
    return validateToken<RefreshTokenPayload>(tokenStr)
  }
}
