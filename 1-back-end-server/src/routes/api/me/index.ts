import { FastifyPluginAsync } from 'fastify'
import { SCHEMA_ME_GET } from './schema.js'
import AppError from '../../../common/error/AppError.js'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: SCHEMA_ME_GET }, async (request) => {
    return request.user
  })
}

export default meRoute
