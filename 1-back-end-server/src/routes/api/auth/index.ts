import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'
import { loginSchema } from './schema.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.get(
    '/login',
    {
      schema: loginSchema,
    },
    async () => {
      return userService.login()
    },
  )

  fastify.get(
    '/register',
    {
      schema: loginSchema,
    },
    async () => {
      return userService.register()
    },
  )
}

export default authRoute
