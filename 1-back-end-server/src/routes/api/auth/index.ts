import { FastifyPluginAsync } from 'fastify'
import UserService from '../../../service/UserService.js'

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.get('/login', {}, async () => {
    return userService.login()
  })
  fastify.get('/register', {}, async () => {
    return userService.register()
  })
}

export default authRoute
