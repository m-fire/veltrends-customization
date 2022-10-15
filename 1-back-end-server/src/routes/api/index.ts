import { FastifyPluginAsync } from 'fastify'
import authRoute from './auth/index.js'
import meRoute from './me/index.js'
import itemsRoute from './items/index.js'

const api: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(meRoute, { prefix: '/me' })
  fastify.register(itemsRoute, { prefix: '/items' })
}

export default api
