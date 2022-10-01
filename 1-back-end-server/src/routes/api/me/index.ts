import { FastifyPluginAsync } from 'fastify'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request) => {
    return 'This page is route `me`'
  })
}

export default meRoute
