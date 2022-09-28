import { FastifyPluginAsync } from 'fastify'

const authRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/login', async () => {
    return 'login'
  })
  fastify.get('/register', async () => {
    return 'register'
  })
}

export default authRoute
