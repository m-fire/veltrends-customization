import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'DevSecretKey'
if (JWT_SECRET == null) {
  console.warn('JWT_SECRET is not defined in rootpath/.env file')
}
export const TOKEN_DURATION = { access: '1h', refresh: '7d' }

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

export function generateToken(payload: TokenPayload) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: TOKEN_DURATION[payload.type],
      },
      (error, token) => {
        if (error || !token) return reject(error)

        resolve(token)
      },
    )
  })
}

export function validateToken<P>(token: string) {
  return new Promise<P>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, token) => {
      if (error || !token) return reject(error)

      resolve(token as DecodedToken<P>)
    })
  })
}
