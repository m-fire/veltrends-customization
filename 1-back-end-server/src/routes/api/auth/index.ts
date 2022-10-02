import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'
import { SCHEMA_LOGIN_POST, SCHEMA_REGISTER_POST } from './schema.js'
import { UserLoginRequest, UserRegisterRequest } from './types.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post<UserLoginRequest>(
    '/login',
    {
      schema: SCHEMA_LOGIN_POST,
    },
    async ({ body: auth }, reply) => {
      const tokensAndUser = await userService.login(auth)

      const { tokens } = tokensAndUser
      reply.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
      })
      reply.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
      })

      return tokensAndUser
    },
  )

  fastify.post<UserRegisterRequest>(
    '/register',
    {
      schema: SCHEMA_REGISTER_POST,
    },
    async ({ body: auth }, reply) => {
      const tokensAndUser = await userService.register(auth)
      reply.statusCode = 201
      return tokensAndUser
    },
  )
}

export default authRoute
