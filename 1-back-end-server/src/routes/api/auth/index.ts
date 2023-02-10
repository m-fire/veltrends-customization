import { FastifyPluginAsyncTypebox } from '../../../core/config/fastify/types.js'
import UserService from '../../../service/UserService.js'
import AppError from '../../../common/error/AppError.js'
import AuthSchema from './schema.js'
import {
  clearCookie,
  CookieTokens,
  setTokenCookies,
} from '../../../core/config/jwt/cookies.js'

// Route Definition

const authRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/login',
    { schema: AuthSchema.Login },
    async ({ body: userInfo }, reply) => {
      const authResult = await UserService.login(userInfo)
      setTokenCookies(reply, authResult.tokens)
      return authResult
    },
  )

  fastify.post(
    '/logout',
    { schema: AuthSchema.Logout },
    async ({ body: authBody }, reply) => {
      clearCookie(reply)
      reply.status(202)
    },
  )

  fastify.post(
    '/register',
    { schema: AuthSchema.Register },
    async ({ body: userInfo }, reply) => {
      const authResult = await UserService.register(userInfo)
      setTokenCookies(reply, authResult.tokens)
      reply.status(201)
      return authResult
    },
  )

  fastify.post(
    '/refresh',
    { schema: AuthSchema.RefreshToken },
    async (request, reply) => {
      const oldToken =
        request.body?.refreshToken ??
        (request.cookies as CookieTokens)?.refresh_token
      if (!oldToken) throw new AppError('BadRequest')

      const tokens = await UserService.refreshToken(oldToken)
      setTokenCookies(reply, tokens)
      reply.status(200)
      return tokens
    },
  )
}

export default authRoute
