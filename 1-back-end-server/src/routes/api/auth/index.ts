import { FastifyPluginAsync, FastifyReply } from 'fastify'
import UserService from '../../../service/UserService.js'
import AppError from '../../../common/error/AppError.js'
import { TokenStringMap } from '../../../service/TokenService.js'
import { AuthRequestMap, CookieTokens } from './types.js'
import { AUTH_SCHEMA_MAP } from './schema.js'

// Route Definition

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post<AuthRequestMap['LOGIN']>(
    '/login',
    { schema: AUTH_SCHEMA_MAP.LOGIN },
    async ({ body: auth }, reply) => {
      const tokensAndUser = await userService.login(auth)
      setTokenCookies(reply, tokensAndUser.tokens)
      return tokensAndUser
    },
  )

  fastify.post<AuthRequestMap['REGISTER']>(
    '/register',
    { schema: AUTH_SCHEMA_MAP.REGISTER },
    async ({ body: userInfo }, reply) => {
      const tokensAndUser = await userService.register(userInfo)
      setTokenCookies(reply, tokensAndUser.tokens)
      reply.statusCode = 201
      return tokensAndUser
    },
  )

  fastify.post<AuthRequestMap['REFRESH_TOKEN']>(
    '/refresh',
    { schema: AUTH_SCHEMA_MAP.REFRESH_TOKEN },
    async (request, reply) => {
      const oldToken =
        request.body?.refreshToken ??
        (request.cookies as CookieTokens)?.refresh_token
      if (!oldToken) throw new AppError('BadReqeustError')

      const tokens = await userService.refreshToken(oldToken)
      setTokenCookies(reply, tokens)
      reply.statusCode = 200
      return tokens
    },
  )

  // ref: https://github.com/fastify/fastify-cookie#example
  function setTokenCookies(
    reply: FastifyReply,
    { accessToken, refreshToken }: TokenStringMap,
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
}

export default authRoute
