import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'
import { SCHEMA_LOGIN_POST, SCHEMA_REGISTER_POST } from './schema.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post(
    '/login',
    {
      schema: SCHEMA_LOGIN_POST,
    },
    async () => {
      return userService.login()
    },
  )

  fastify.post(
    '/register',
    {
      schema: SCHEMA_REGISTER_POST,
    },
    async () => {
      return userService.register()
    },
  )
}

export default authRoute
