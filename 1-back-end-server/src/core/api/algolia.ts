import { Item, Publisher } from '@prisma/client'
import { client as algoliaClient } from '../config/algolia/index.js'
import { Pagination } from '../config/fastify/types.js'
import { ItemsResponseCodeMap } from '../../routes/api/items/schema.js'

const itemsIndex = algoliaClient.initIndex('veltrend_items')

const algoliaApis = {
  async searchItem(
    query: string,
    { offset = 0, length = 20 }: SearchItemOption,
  ) {
    const result = await itemsIndex.search<HitItem>(query, {
      offset,
      length,
    })

    const hasNextPage = offset + length < result.nbHits

    const hitsItemPage: Pagination<(typeof result.hits)[0]> = {
      list: result.hits,
      totalCount: result.nbHits,
      pageInfo: {
        nextOffset: hasNextPage ? offset + length : null,
        hasNextPage,
      },
    }
    return hitsItemPage
  },

  syncItemIndex(item: ItemForAlgolia) {
    return itemsIndex.saveObject({
      ...item,
      objectID: item.id,
    })
  },

  deleteItemIndex(objectID: number) {
    return itemsIndex.deleteObject(objectID.toString())
  },
}
export default algoliaApis

// types

export type SearchItemOption = {
  offset?: number
  length?: number
}

type HitItem = ItemsResponseCodeMap['GetItem']['200']

export type ItemForAlgolia = Pick<
  Item,
  'id' | 'title' | 'body' | 'author' | 'link' | 'thumbnail'
> & {
  username: string
  publisher: Publisher
}
