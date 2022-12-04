import { FastifyPluginAsync } from 'fastify'
import { SEARCH_SCHEMA } from './schema.js'
import { SearchRequestMap } from './types.js'
import algolia from '../../../core/api/items/algolia.js'

const searchRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<SearchRequestMap['SEARCH']>(
    '/',
    { schema: SEARCH_SCHEMA.SEARCH },
    async (request) => {
      const { q, limit, offset } = request.query

      const hits = await algolia.searchItem(q, { length: limit, offset })
      return hits
    },
  )
}
export default searchRoute
