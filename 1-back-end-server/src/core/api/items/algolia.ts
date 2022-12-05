import { Item, Publisher } from '@prisma/client'
import { client as algoliaClient } from '../../../common/config/algolia/index.js'
import { Pagination } from '../../../common/config/fastify/types.js'
import { ItemsResponseCodeMap } from '../../../routes/api/items/types.js'

const itemsIndex = algoliaClient.initIndex('veltrend_items')

const algolia = {
  searchItem: async (
    query: string,
    { offset = 0, length = 20 }: ItemSearchOption = {},
  ) => {
    const result = await itemsIndex.search<HitItem>(query, {
      offset,
      length,
    })

    const hasNextPage = offset + length < result.nbHits
    type ItemResult = typeof result.hits[0]

    const hitsItemPage: Pagination<ItemResult> = {
      list: result.hits,
      totalCount: result.nbHits,
      pageInfo: {
        nextOffset: hasNextPage ? offset + length : null,
        hasNextPage,
      },
    }
    return hitsItemPage
  },

  syncItemIndex: (item: ItemForAlgolia) => {
    return itemsIndex.saveObject({
      ...item,
      objectID: item.id,
    })
  },

  deleteItemIndex: (objectID: number) => {
    return itemsIndex.deleteObject(objectID.toString())
  },
}
export default algolia

// types

export type ItemSearchOption = {
  offset?: number
  length?: number
}

type HitItem = ItemsResponseCodeMap['GET_ITEM']['200']

export type ItemForAlgolia = Pick<
  Item,
  'id' | 'title' | 'body' | 'author' | 'link' | 'thumbnail'
> & {
  username: string
  publisher: Publisher
}
