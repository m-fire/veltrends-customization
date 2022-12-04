import { client as algoliaClient } from '../../../common/config/algolia/index.js'
import { Pagination } from '../../../common/config/fastify/types.js'
import { ItemsResponseCodeMap } from '../../../routes/api/items/types.js'

const itemsIndex = algoliaClient.initIndex('veltrend_items')

const algolia = {
  searchItem: async (
    query: string,
    { offset = 0, length = 20 }: SearchOption = {},
  ) => {
    const result = await itemsIndex.search<SearchedItem>(query, {
      offset,
      length,
    })

    const hasNextPage = offset + length < result.nbHits
    type ItemResult = typeof result.hits[0]

    const pagination: Pagination<ItemResult> = {
      list: result.hits,
      totalCount: result.nbHits,
      pageInfo: {
        nextOffset: hasNextPage ? offset + length : null,
        hasNextPage,
      },
    }
    return pagination
  },
}
export default algolia

// types

type SearchOption = {
  offset?: number
  length?: number
}

type SearchedItem = ItemsResponseCodeMap['GET_ITEM']['200']
