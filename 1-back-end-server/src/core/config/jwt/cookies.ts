import { FastifyReply } from 'fastify'
import { AuthResponseCodeMap } from '../../../routes/api/auth/schema.js'

// ref: https://github.com/fastify/fastify-cookie#example

export function setTokenCookies(
  reply: FastifyReply,
  { accessToken, refreshToken }: AuthToken,
) {
  reply.cookie('access_token', accessToken, {
    // signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1h
    path: '/',
  })
  reply.cookie('refresh_token', refreshToken, {
    // signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7d
    path: '/',
  })
}
type AuthToken = AuthResponseCodeMap['Login']['200']['tokens']

export function clearCookie(reply: FastifyReply) {
  reply.clearCookie('access_token')
  reply.clearCookie('refresh_token')
}

export interface CookieTokens {
  access_token?: string
  refresh_token?: string
}
