import { Token } from '@prisma/client'
import db from '../core/config/prisma/index.js'
import Tokens, { RefreshTokenPayload } from '../core/config/jwt/tokens.js'
import { AuthResponseCodeMap } from '../routes/api/auth/schema.js'

export default class TokenService {
  static async generateTokens(
    { id: userId, username }: AuthUserInfo,
    token?: Token,
  ): Promise<AuthTokens> {
    const { id: tokenId, rotationCounter } =
      token ?? (await db.token.create({ data: { userId } }))

    const [accessToken, refreshToken] = await Promise.all([
      Tokens.generateToken({
        type: 'access',
        tokenId,
        userId,
        username,
      }),
      Tokens.generateToken({
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
    return Tokens.validateToken<RefreshTokenPayload>(tokenStr)
  }
}

type AuthTokens = AuthResponseCodeMap['Login']['200']['tokens']
type AuthUserInfo = AuthResponseCodeMap['Login']['200']['user']
