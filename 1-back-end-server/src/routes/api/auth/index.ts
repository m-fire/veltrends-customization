import { FastifyPluginAsyncTypebox } from '../../../core/config/fastify/types.js'
import UserService from '../../../service/UserService.js'
import AppError from '../../../common/error/AppError.js'
import { AuthRequestMap } from './types.js'
import AUTH_SCHEMA from './schema.js'
import {
  clearCookie,
  CookieTokens,
  setTokenCookies,
} from '../../../common/config/jwt/cookies.js'

// Route Definition

const authRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/login',
    { schema: AUTH_SCHEMA.LOGIN },
    async ({ body: authBody }, reply) => {
      const tokensAndUser = await UserService.login(authBody)
      setTokenCookies(reply, tokensAndUser.tokens)
      return tokensAndUser
    },
  )

  fastify.post<AuthRequestMap['LOGOUT']>(
    '/logout',
    { schema: AUTH_SCHEMA.LOGOUT },
    async ({ body: authBody }, reply) => {
      clearCookie(reply)
      reply.statusCode = 202
    },
  )

  fastify.post<AuthRequestMap['REGISTER']>(
    '/register',
    { schema: AUTH_SCHEMA.REGISTER },
    async ({ body: userInfo }, reply) => {
      const tokensAndUser = await UserService.register(userInfo)
      setTokenCookies(reply, tokensAndUser.tokens)
      reply.statusCode = 201
      return tokensAndUser
    },
  )

  fastify.post<AuthRequestMap['REFRESH_TOKEN']>(
    '/refresh',
    { schema: AUTH_SCHEMA.REFRESH_TOKEN },
    async (request, reply) => {
      const oldToken =
        request.body?.refreshToken ??
        (request.cookies as CookieTokens)?.refresh_token
      if (!oldToken) throw new AppError('BadRequest')

      const tokens = await UserService.refreshToken(oldToken)
      setTokenCookies(reply, tokens)
      reply.statusCode = 200
      return tokens
    },
  )
}

export default authRoute
