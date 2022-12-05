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

      const hitsPage = await ItemService.Algolia.getHitsItemPage(q, {
        length: limit,
        offset,
      })
      const list = await ItemService.Algolia.getSearchedItemList(hitsPage)

      return { ...hitsPage, list }
    },
  )
}
export default searchRoute
