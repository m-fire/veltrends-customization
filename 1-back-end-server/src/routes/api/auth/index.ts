import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.get(
    '/login',
    {
      schema: {
        tags: ['auth', 'user'],
      },
    },
    async () => {
      return userService.login()
    },
  )
  fastify.get(
    '/register',
    {
      schema: {
        tags: ['auth'],
      },
    },
    async () => {
      return userService.register()
    },
  )
}

export default authRoute
