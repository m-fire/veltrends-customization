import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'DevSecretKey'
if (JWT_SECRET == null) {
  console.warn('JWT_SECRET is not defined in rootpath/.env file')
}
export const TOKEN_DURATION = { access: '1m', refresh: '30d' } as const

// Types

export interface AccessTokenPayload {
  userId: number
  tokenId: number
  username: string
}

export interface RefreshTokenPayload {
  tokenId: number
  rotationCounter: number
}

export type TokenPayload = (AccessTokenPayload | RefreshTokenPayload) & {
  type: keyof typeof TOKEN_DURATION
}

type DecodedToken<T> = {
  iat: number
  exp: number
} & T

export default class Tokens {
  static generateToken(payload: TokenPayload) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        JWT_SECRET,
        {
          expiresIn: TOKEN_DURATION[payload.type],
        },
        (error, tokenStr) => {
          if (error || !tokenStr) return reject(error)

          resolve(tokenStr)
        },
      )
    })
  }

  static validateToken<P>(tokenStr: string) {
    return new Promise<P>((resolve, reject) => {
      jwt.verify(tokenStr, JWT_SECRET, (error, jwtPayload) => {
        if (error || !jwtPayload) return reject(error)

        resolve(jwtPayload as DecodedToken<P>)
      })
    })
  }
}
