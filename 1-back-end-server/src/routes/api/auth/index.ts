import { FastifyPluginAsync, FastifyReply } from 'fastify'
import UserService from '../../../service/UserService.js'
import AppError from '../../../common/error/AppError.js'
import { CookieTokens } from '../../../common/config/fastify/types.js'
import { TokenStringMap } from '../../../service/TokenService.js'
import {
  UserLoginRequest,
  RefreshTokenRequest,
  UserRegisterRequest,
} from './types.js'
import {
  AUTH_LOGIN_POST,
  AUTH_REFRESH_POST,
  AUTH_REGISTER_POST,
} from './schema.js'

// Route Definition

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post<UserLoginRequest>(
    '/login',
    {
      schema: AUTH_LOGIN_POST,
    },
    async ({ body: auth }, reply) => {
      const tokensAndUser = await userService.login(auth)
      setTokenCookies(reply, tokensAndUser.tokens)
      return tokensAndUser
    },
  )

  fastify.post<UserRegisterRequest>(
    '/register',
    {
      schema: AUTH_REGISTER_POST,
    },
    async ({ body: userInfo }, reply) => {
      const tokensAndUser = await userService.register(userInfo)
      reply.statusCode = 201
      return tokensAndUser
    },
  )

  fastify.post<RefreshTokenRequest>(
    '/refresh',
    {
      schema: AUTH_REFRESH_POST,
    },
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
