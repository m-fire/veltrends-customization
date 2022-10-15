import { FastifyPluginAsync } from 'fastify'
import { ItemWriteRequest } from './types.js'
import { ITEMS_POST_SCHEMA } from './schema.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<ItemWriteRequest>(
    '/',
    { schema: ITEMS_POST_SCHEMA },
    ({ body }) => {
      return body
    },
  )

  fastify.get('/', async (fastify) => {
    return 'GET api/items/index.ts'
  })
}
export default itemsRoute
