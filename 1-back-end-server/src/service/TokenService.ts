import { Token } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import {
  generateToken,
  RefreshTokenPayload,
  validateToken,
} from '../common/config/jwt/tokens.js'
import { AuthResponseCodeMap } from '../routes/api/auth/types.js'

export default class TokenService {
  static async generateTokens(
    { id: userId, username }: AuthUserInfo,
    token?: Token,
  ): Promise<AuthTokens> {
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

type AuthTokens = AuthResponseCodeMap['LOGIN']['200']['tokens']
type AuthUserInfo = AuthResponseCodeMap['LOGIN']['200']['user']
