import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'
import { SCHEMA_POST_LOGIN, SCHEMA_POST_REGISTER } from './schema.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post(
    '/login',
    {
      schema: SCHEMA_POST_LOGIN,
    },
    async () => {
      return userService.login()
    },
  )

  fastify.post(
    '/register',
    {
      schema: SCHEMA_POST_REGISTER,
    },
    async () => {
      return userService.register()
    },
  )
}

export default authRoute
