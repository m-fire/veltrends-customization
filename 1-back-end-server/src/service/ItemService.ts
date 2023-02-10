import { Bookmark, Item, ItemLike, Publisher, User } from '@prisma/client'
import senitize from 'sanitize-html'
import { PaginationOptions } from '../core/config/fastify/types.js'
import PublisherService from './PublisherService.js'
import ItemStatusService from './ItemStatusService.js'
import ItemLikeService from './ItemLikeService.js'
import { MetaScrapper } from '../core/util/meta-scrapper.js'
import Algolia, { SearchItemOption } from '../core/api/algolia.js'
import { RankCalculator } from '../core/util/calculates.js'
import { ListMode } from '../core/pagination/types.js'
import ItemsListingStrategy from './listing/ItemsListingStrategy.js'
import { Pages } from '../core/util/paginations.js'
import ItemRepository from '../repository/ItemRepository.js'
import { ItemsRequestMap } from '../routes/api/items/schema.js'
import { TypeMapper } from '../common/util/type-mapper.js'
import db from '../core/config/prisma'

// prisma include conditions
const LIMIT_ITEMS = 20 as const

class ItemService {
  static async createItem(
    userId: number,
    { title, body, link /* , tags */ }: CreateItemParams,
  ) {
    const {
      domain,
      url: originLink,
      og: { publisher: name, favicon, thumbnail, author },
    } = await MetaScrapper.scrap(link)

    const newPublisher = await PublisherService.createPublisher({
      domain,
      name,
      favicon,
    })

    const newItem = await IR.createItem({
      title,
      body,
      link: originLink, // tags: [],
      userId,
      thumbnail: thumbnail,
      author: author ?? undefined,
      publisher: newPublisher,
    })

    /* 아이탬 생성시, 알고리아 DB에 추가 */
    IS.Algolia.syncItem(newItem)

    const newStatus = await ItemStatusService.createItemStatus(newItem.id)

    const newItemWithStatus = { ...newItem, itemStatus: newStatus }

    const serializedItem = IS.serialize(newItemWithStatus)
    return serializedItem
  }

  static async getItemList({
    mode = 'recent',
    cursor,
    userId,
    limit,
    startDate,
    endDate,
  }: ItemListPagingOptions) {
    //
    const strategy = ItemsListingStrategy.getStrategy(mode)
    const listingInfo = await strategy.listing({
      cursor,
      userId,
      limit: limit || LIMIT_ITEMS,
      startDate,
      endDate,
    })
    if (listingInfo.totalCount === 0 || listingInfo.list.length === 0)
      return Pages.emptyPage()

    const serializedItemList = listingInfo.list.map((item) =>
      IS.serialize(item),
    )
    return Pages.createPage({
      ...listingInfo,
      list: serializedItemList,
    })
  }

  static async getItem({ itemId, userId }: GetItemParams) {
    const item = await IR.findItemOrThrow(itemId, {
      include: IR.Query.includePartialRelation(userId),
    })

    const serializedItem = IS.serialize(item)
    return serializedItem
  }

  static async editItem({
    itemId,
    userId,
    link,
    title,
    body, // tags,
  }: EditItemParams) {
    const updatedItem = await IR.updateItem(itemId, {
      userId,
      title,
      body,
      link, // tags: [],
    })

    IS.Algolia.syncItem(updatedItem)

    const serializedItem = IS.serialize(updatedItem)
    return serializedItem
  }

  static async deleteItem(params: DeleteItemParams) {
    await IR.deleteItem(params)
    IS.Algolia.deleteItem(params.itemId)
  }

  static async likeItem({ itemId, userId }: ItemActionParams) {
    const itemStatus = await ItemLikeService.like({ itemId, userId })
    const scoredStatusOrNull = await IS.getScoredStatusOrNull(
      itemId,
      itemStatus.likeCount,
    )
    return scoredStatusOrNull ?? itemStatus
  }

  static async unlikeItem({ itemId, userId }: ItemActionParams) {
    const itemStatus = await ItemLikeService.unlike({ itemId, userId })
    const scoredStatusOrNull = await IS.getScoredStatusOrNull(
      itemId,
      itemStatus.likeCount,
    )
    return scoredStatusOrNull ?? itemStatus
  }

  /* utils */

  static serialize<T extends Item & Relations>(item: T) {
    const mappedItem = TypeMapper.mapProps(
      item,
      Date,
      (d) => d.toISOString(),
      true,
    )
    return {
      ...mappedItem,
      isLiked: !!item.itemLikes?.length,
      isBookmarked: !!item.bookmarks?.length,
    }
  }

  private static async getScoredStatusOrNull(
    itemId: number,
    likeCount?: number,
  ) {
    const parialItem = await IR.findPartialItemOrNull(itemId, {
      select: { createdAt: true },
    })
    if (parialItem == null) return null

    try {
      const likes = likeCount ?? (await ItemLikeService.countLike(itemId))
      const score = RankCalculator.rankingScore(likes, parialItem.createdAt)

      const scoredStatus = await ItemStatusService.updateScore({
        itemId,
        score,
      })
      return scoredStatus
    } catch (e) {
      console.error(`ItemService.ts> getScoredStatusOrNull()`, { e })
    }

    return null
  }

  /**
   * Item Algolia Service
   */
  public static Algolia = class ItemsAlgoliaService {
    static syncItem(item: ItemWithPatials) {
      Algolia.syncItemIndex({
        id: item.id,
        title: item.title,
        author: item.author,
        body: item.body,
        link: item.link,
        thumbnail: item.thumbnail,
        username: item.user.username,
        publisher: item.publisher,
      })
        .then((resposne) =>
          console.log(`ItemAlgoliaService. async syncItem() > then`, {
            resposne,
          }),
        )
        .catch(console.error)
    }

    static deleteItem(itemId: number) {
      Algolia.deleteItemIndex(itemId).catch(console.error)
    }

    static async getHitsItemPage(query: string, options: SearchItemOption) {
      return Algolia.searchItem(query, options)
    }

    static async getSearchedItemList(
      hitsPage: Awaited<ReturnType<typeof Algolia.searchItem>>,
    ) {
      const ids = hitsPage.list.map((item) => item.id)
      const itemMap = await IR.findItemMapByIds(ids, {
        select: {
          id: true,
          title: true,
          body: true,
          author: true,
          link: true,
          itemStatus: {
            select: { likeCount: true },
          },
          publisher: {
            select: { name: true, favicon: true, domain: true },
          },
        },
      })

      const serializedHits = hitsPage.list
        .filter((hit) => itemMap[hit.id] == null)
        .map((hit) => {
          const hitItem = itemMap[hit.id]

          const titleOrNull = hit._highlightResult?.title?.value || null
          const bodyOrNull = hit._highlightResult?.body?.value || null

          return {
            id: hitItem.id,
            link: hitItem.link ?? '',
            title: hitItem.title,
            body: hitItem.body,
            author: hitItem.author,
            publisher: hitItem.publisher,
            highlight: {
              /* senitize: XSS 공격 무효화 - 공격용JS코드가 심겨질만한 HTML 검사 */
              title: titleOrNull ? senitize(titleOrNull) : null,
              body: bodyOrNull ? senitize(bodyOrNull) : null,
            },
            likeCount: hitItem.itemStatus?.likeCount ?? 0,
          }
        })

      return serializedHits
    }
  }
}

export default ItemService

const IS = ItemService
const IR = ItemRepository

// types

type CreateItemParams = ItemsRequestMap['CreateItem']['Body']

type ItemListPagingOptions = PaginationOptions & {
  mode: ListMode
  startDate?: string
  endDate?: string
}

type GetItemParams = {
  itemId: number
  userId?: number
}

type EditItemParams = ItemsRequestMap['EditItem']['Body'] & {
  itemId: number
  userId: number
}

type DeleteItemParams = {
  itemId: number
  userId: number
}

type ItemActionParams = {
  itemId: number
  userId: number
}

type ItemWithPatials = Item & {
  user: Pick<User, 'id' | 'username'>
  publisher: Publisher
}

type Relations = {
  itemLikes?: Pick<ItemLike, 'id'>[]
  bookmarks?: Pick<Bookmark, 'id'>[]
}
