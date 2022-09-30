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
    async () => {
      return userService.login()
    },
  )

  fastify.post<UserRegisterRequest>(
    '/register',
    {
      schema: SCHEMA_REGISTER_POST,
    },
    async ({ body: auth }) => {
      const authTokenAndUserinfo = await userService.register(auth)
      return authTokenAndUserinfo
    },
  )
}

export default authRoute
