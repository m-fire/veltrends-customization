import { FastifyPluginAsync } from 'fastify'
import { SCHEMA_ME_GET } from './schema.js'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: SCHEMA_ME_GET }, async (request) => {
    return 'This page is route `me`'
  })
}

export default meRoute
