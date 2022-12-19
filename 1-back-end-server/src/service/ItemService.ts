import {
  Bookmark,
  Item,
  ItemLike,
  ItemStatus,
  Publisher,
  User,
} from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import { ItemsRequestMap } from '../routes/api/items/types.js'
import {
  Pagination,
  PaginationOptions,
} from '../common/config/fastify/types.js'
import AppError from '../common/error/AppError.js'
import PublisherService from './PublisherService.js'
import ItemStatusService from './ItemStatusService.js'
import ItemLikeService from './ItemLikeService.js'
import { getOriginItemInfo } from '../common/api/external-items.js'
import algolia from '../core/api/items/algolia.js'
import { RankCalculator } from '../core/util/calculates.js'
import { ListMode } from '../core/pagination/types.js'
import ItemsListingStrategy from './listing/ItemsListingStrategy.js'
import { createEmptyPage, createPage } from '../core/util/paginations.js'

// prisma include conditions
const LIMIT_ITEMS = 20 as const

class ItemService {
  private static instance: ItemService
  private publisherService = PublisherService.getInstance()
  private itemStatusService = ItemStatusService.getInstance()
  private itemLikeService = ItemLikeService.getInstance()

  static getInstance() {
    if (!IS.instance) {
      IS.instance = new ItemService()
    }
    return IS.instance
  }

  private constructor() {}

  /* Public APIs */

  async createItem(
    userId: number,
    { title, body, link, tags }: CreateItemParams,
  ) {
    const {
      domain,
      url: originLink,
      og: { publisher: name, favicon, thumbnail, author },
    } = await getOriginItemInfo(link)
    const newPublisher = await this.publisherService.createPublisher({
      domain,
      name,
      favicon,
    })

    const newItem = await db.item.create({
      data: {
        title,
        body,
        link: originLink,
        userId,
        thumbnail: thumbnail,
        author: author ?? undefined,
        publisherId: newPublisher.id,
      },
      include: ItemService.queryIncludeRelations(userId),
    })

    /* 아이탬 생성시, 알고리아 DB에 추가 */
    IS.Algolia.syncItem(newItem)

    const newStatus = await this.itemStatusService.createItemStatus(newItem.id)

    const newItemWithStatus = { ...newItem, itemStatus: newStatus }

    const serializedItem = IS.serialize(newItemWithStatus)
    return serializedItem
  }

  async getItemList({
    mode = 'recent',
    cursor: ltCursor,
    userId,
    limit,
    startDate,
    endDate,
  }: ItemListPagingOptions): Promise<Pagination<ItemOrItemWithStatus>> {
    //
    const strategy = ItemsListingStrategy.getStrategy(mode)
    const listingInfo = await strategy.listing({
      ltCursor,
      userId,
      limit: limit ?? LIMIT_ITEMS,
      startDate,
      endDate,
    })
    if (listingInfo.totalCount === 0) return createEmptyPage()

    const { list, totalCount, hasNextPage, lastCursor } = listingInfo

    const serializedItemList = list.map((item) => IS.serialize(item))

    const itemListPage = createPage({
      list: serializedItemList,
      totalCount,
      hasNextPage,
      lastCursor,
    })
    return itemListPage
  }

  async getItem({ itemId, userId }: GetItemParams) {
    const item = await IS.findItemOrThrow({
      itemId,
      userId,
      include: IS.queryIncludeRelations(userId),
    })

    const serializedItem = IS.serialize(item)
    return serializedItem
  }

  async editItem({ itemId, userId, link, title, body, tags }: EditItemParams) {
    await IS.findItemOrThrow({ itemId, userId })

    const updatedItem = await db.item.update({
      where: { id: itemId },
      data: { link, title, body },
      include: ItemService.queryIncludeRelations(userId),
    })

    IS.Algolia.syncItem(updatedItem)

    const serializedItem = IS.serialize(updatedItem)
    return serializedItem
  }

  async deleteItem({ itemId, userId }: DeleteItemParams) {
    await IS.findItemOrThrow({ itemId, userId })
    await db.item.delete({ where: { id: itemId } })
    IS.Algolia.deleteItem(itemId)
  }

  async likeItem({ itemId, userId }: ItemActionParams) {
    const itemStatus = await this.itemLikeService.like({ itemId, userId })
    const scoredStatusOrNull = await this.getScoredStatusOrNull(
      itemId,
      itemStatus.likeCount,
    )
    return scoredStatusOrNull ?? itemStatus
  }

  async unlikeItem({ itemId, userId }: ItemActionParams) {
    const itemStatus = await this.itemLikeService.unlike({ itemId, userId })
    const scoredStatusOrNull = await this.getScoredStatusOrNull(
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

  private async getScoredStatusOrNull(itemId: number, likeCount?: number) {
    const item = await db.item.findUnique({
      select: { createdAt: true },
      where: { id: itemId },
    })
    if (!item) return null

    try {
      const likes = likeCount ?? (await this.itemLikeService.countLike(itemId))
      const score = RankCalculator.rankingScore(likes, item.createdAt)

      const scoredStatus = await this.itemStatusService.updateScore({
        itemId,
        score,
      })
      return scoredStatus
    } catch (e) {
      console.error(`ItemService.ts> getScoredStatusOrNull()`, { e })
    }

    return null
  }

  private static async findItemOrThrow({
    itemId,
    userId,
    include,
  }: {
    itemId: number
    userId?: number | null
    include?: Partial<Parameters<typeof db.item.findUnique>[0]['include']>
  }) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: { ...include },
    })

    // userId 를 비교해야 한다면, 반드시 item.userId 와 동일해야 한다.
    if (userId != null && item?.userId !== userId)
      throw new AppError('Forbidden')

    if (item == null) throw new AppError('NotFound')

    return item
  }

  static queryIncludeRelations(userId: number | null | undefined) {
    return {
      user: {
        select: { id: true, username: true },
      },
      itemStatus: {
        select: {
          id: true,
          likeCount: true,
          commentCount: true,
          score: true,
        },
      },
      publisher: true,
      itemLikes: userId ? { where: { userId } } : false,
      bookmarks: userId ? { where: { userId } } : false,
    }
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
      const itemMap = await IS.getItemListByIdMap(itemIds)

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

  static async getItemListByIdMap(itemIds: number[]) {
    const itemList = await db.item.findMany({
      where: { id: { in: itemIds } },
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

    const itemByIdMap = itemList.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<number, typeof itemList[0]>)

    return itemByIdMap
  }
}
const IS = ItemService
export default ItemService

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
