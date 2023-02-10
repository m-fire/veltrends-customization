import { FastifyPluginAsyncTypebox } from '../../../core/config/fastify/types.js'
import { SearchSchema } from './schema.js'
import ItemService from '../../../service/ItemService.js'

const searchRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/', { schema: SearchSchema.Search }, async (request) => {
    const { q, limit, offset } = request.query

    const hitsPage = await ItemService.Algolia.getHitsItemPage(q, {
      length: limit,
      offset,
    })
    const list = await ItemService.Algolia.getSearchedItemList(hitsPage)

    return { ...hitsPage, list }
  })
}
export default searchRoute
