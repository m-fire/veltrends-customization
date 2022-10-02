import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'
import { AUTH_LOGIN_POST, AUTH_REGISTER_POST } from './schema.js'
import { UserLoginRequest, UserRegisterRequest } from './types.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post<UserLoginRequest>(
    '/login',
    {
      schema: AUTH_LOGIN_POST,
    },
    async ({ body: auth }, reply) => {
      const tokensAndUser = await userService.login(auth)

      // ref: https://github.com/fastify/fastify-cookie#example
      const { tokens } = tokensAndUser
      reply.cookie('access_token', tokens.accessToken, {
        // signed: true,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60), // 1h
        path: '/',
      })
      reply.cookie('refresh_token', tokens.refreshToken, {
        // signed: true,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7d
        path: '/',
      })

      return tokensAndUser
    },
  )

  fastify.post<UserRegisterRequest>(
    '/register',
    {
      schema: AUTH_REGISTER_POST,
    },
    async ({ body: auth }, reply) => {
      const tokensAndUser = await userService.register(auth)
      reply.statusCode = 201
      return tokensAndUser
    },
  )
}

export default authRoute
