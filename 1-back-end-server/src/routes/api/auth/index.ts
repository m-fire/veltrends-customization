import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'
import { loginPostSchema, registerPostSchema } from './schema.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post(
    '/login',
    {
      schema: loginPostSchema,
    },
    async () => {
      return userService.login()
    },
  )

  fastify.post(
    '/register',
    {
      schema: registerPostSchema,
    },
    async () => {
      return userService.register()
    },
  )
}

export default authRoute
