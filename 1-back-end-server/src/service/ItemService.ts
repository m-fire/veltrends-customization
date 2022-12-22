import {
  Bookmark,
  Item,
  ItemLike,
  ItemStatus,
  Publisher,
  User,
} from '@prisma/client'
import { ItemsRequestMap } from '../routes/api/items/types.js'
import {
  Pagination,
  PaginationOptions,
} from '../common/config/fastify/types.js'
import PublisherService from './PublisherService.js'
import ItemStatusService from './ItemStatusService.js'
import ItemLikeService from './ItemLikeService.js'
import { getOriginItemInfo } from '../common/api/external-items.js'
import algolia from '../core/api/items/algolia.js'
import { RankCalculator } from '../core/util/calculates.js'
import { ListMode } from '../core/pagination/types.js'
import ItemsListingStrategy from './listing/ItemsListingStrategy.js'
import { createEmptyPage, createPage } from '../core/util/paginations.js'
import ItemRepository from '../repository/ItemRepository.js'

// prisma include conditions
const LIMIT_ITEMS = 20 as const

class ItemService {
  static async createItem(
    userId: number,
    { title, body, link, tags }: CreateItemParams,
  ) {
    const {
      domain,
      url: originLink,
      og: { publisher: name, favicon, thumbnail, author },
    } = await getOriginItemInfo(link)
    const newPublisher = await PublisherService.createPublisher({
      domain,
      name,
      favicon,
    })

    const newItem = await IR.createItem({
      title,
      body,
      link: originLink,
      // tags: [],
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
  }: ItemListPagingOptions): Promise<Pagination<ItemOrItemWithStatus>> {
    //
    const strategy = ItemsListingStrategy.getStrategy(mode)
    const listingInfo = await strategy.listing({
      cursor,
      userId,
      limit: limit || LIMIT_ITEMS,
      startDate,
      endDate,
    })
    if (listingInfo.totalCount === 0) return createEmptyPage()

    const serializedItemList = listingInfo.list.map((item) =>
      IS.serialize(item),
    )
    return createPage({
      ...listingInfo,
      list: serializedItemList,
    })
  }

  static async getItem({ itemId, userId }: GetItemParams) {
    const item = await IR.findItemOrThrow({
      itemId,
      userId,
    })

    const serializedItem = IS.serialize(item)
    return serializedItem
  }

  static async editItem({
    itemId,
    userId,
    link,
    title,
    body,
    tags,
  }: EditItemParams) {
    const updatedItem = await IR.updateItem(itemId, {
      userId,
      title,
      body,
      link,
      // tags: [],
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

  static serialize(item: Item & Relations) {
    return {
      ...item,
      isLiked: !!item.itemLikes?.length,
      isBookmarked: !!item.bookmarks?.length,
    }
  }

  private static async getScoredStatusOrNull(
    itemId: number,
    likeCount?: number,
  ) {
    const parialItem = await IR.findItemOrPartial(itemId, {
      createdAt: true,
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
    static syncItem(item: ItemWithPatialUser) {
      algolia
        .syncItemIndex({
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
      algolia.deleteItemIndex(itemId).catch(console.error)
    }

    static getHitsItemPage = algolia.searchItem

    static async getSearchedItemList(
      hitsPage: Awaited<ReturnType<typeof algolia.searchItem>>,
    ) {
      const itemIds = hitsPage.list.map((item) => item.id)
      const itemMap = await IR.findItemMapByIds(itemIds, {
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
      })

      const serializedList = hitsPage.list
        .map((hit) => {
          const item = itemMap[hit.id]
          if (!item) return null

          const searchedItem = {
            id: item.id,
            link: item.link,
            title: item.title,
            body: item.body,
            author: item.author === '' ? null : item.author,
            publisher: item.publisher,
            likeCount: item.itemStatus?.likeCount,
            highlight: {
              title: hit._highlightResult?.title?.value ?? null,
              body: hit._highlightResult?.body?.value ?? null,
            },
          }
          return searchedItem
        })
        .filter((item) => item !== null)

      return serializedList
    }
  }
}
export default ItemService

const IS = ItemService
const IR = ItemRepository

// types

type CreateItemParams = ItemsRequestMap['CREATE_ITEM']['Body']

type ItemListPagingOptions = PaginationOptions & {
  mode: ListMode
  startDate?: string
  endDate?: string
}

type GetItemParams = {
  itemId: number
  userId?: number
}

type ItemOrItemWithStatus = Item | ItemWithStatus

type ItemWithStatus = Item & { itemStatus: ItemStatus | null }

type EditItemParams = ItemsRequestMap['EDIT_ITEM']['Body'] & {
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

type ItemWithPatialUser = Item & {
  user: Pick<User, 'id' | 'username'>
  publisher: Publisher
}

type Relations = {
  itemLikes?: ItemLike[]
  bookmarks?: Bookmark[]
}
