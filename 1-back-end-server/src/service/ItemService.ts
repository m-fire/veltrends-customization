import { Item, ItemLike, ItemStatus, Publisher, User } from '@prisma/client'
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
import itemsModePagination from './paging/items/items-paginations.js'

// prisma include conditions
const INCLUDE_SIMPLE_USER = { select: { id: true, username: true } } as const

const LIMIT_PER_FIND = 20 as const

class ItemService {
  private static instance: ItemService
  private publisherService = PublisherService.getInstance()
  private itemStatusService = ItemStatusService.getInstance()
  private itemLikeService = ItemLikeService.getInstance()

  static getInstance() {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService()
    }
    return ItemService.instance
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

    const newItem: ItemWithPatialUser = await db.item.create({
      data: {
        title,
        body,
        link: originLink,
        userId,
        thumbnail: thumbnail,
        author: author ?? undefined,
        publisherId: newPublisher.id,
      },
      include: {
        user: INCLUDE_SIMPLE_USER,
        publisher: true,
      },
    })

    const newItemStatus = await this.itemStatusService.createItemStatus(
      newItem.id,
    )
    const newItemWithStatus = { ...newItem, itemStatus: newItemStatus }
    const likeByIdsMap = await this.itemLikeService.itemLikeByIdsMap({
      itemIds: [newItem.id],
      userId,
    })

    ItemService.Algolia.syncItem(newItem)

    const itemWithLike = ItemService.mergeItemLike(
      newItemWithStatus,
      likeByIdsMap[newItem.id],
    )

    return itemWithLike
  }

  async getItemList({
    mode = 'recent',
    cursor: ltCursor,
    userId,
    limit,
    startDate,
    endDate,
  }: ItemListPagingOptions): Promise<Pagination<ItemOrItemWithStatus> | []> {
    //
    const modePagination = itemsModePagination.getPagination(mode)
    const pagingResult = await modePagination.paging({
      ltCursor,
      limit: limit ?? LIMIT_PER_FIND,
      startDate,
      endDate,
    })

    if (pagingResult == null) {
      return ItemService.emptyPagination()
    }

    const { itemList, totalCount, hasNextPage, lastCursor } = pagingResult
    const likeByIdsMap = await this.itemLikeService.itemLikeByIdsMap({
      itemIds: itemList.map((item) => item.id),
      userId: userId ?? undefined,
    })
    const itemWithLikeList = itemList.map((item) =>
      ItemService.mergeItemLike(item, likeByIdsMap[item.id]),
    )

    const itemListPage = ItemService.createPagination(
      itemWithLikeList,
      totalCount,
      hasNextPage,
      lastCursor,
    )
    return itemListPage
  }

  async getItem({ itemId, userId }: GetItemParams) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: {
        user: INCLUDE_SIMPLE_USER,
        publisher: true,
        itemStatus: true,
      },
    })
    if (!item) throw new AppError('NotFound')

    const likeByIdsMap = await this.itemLikeService.itemLikeByIdsMap({
      itemIds: [itemId],
      userId,
    })
    const itemWithLike = ItemService.mergeItemLike(item, likeByIdsMap[itemId])

    return itemWithLike
  }

  async updateItem({
    itemId,
    userId,
    link,
    title,
    body,
    tags,
  }: UpdateItemParams) {
    await ItemService.findItemOrThrow(itemId, userId)
    const updatedItem: ItemWithPatialUser = await db.item.update({
      where: { id: itemId },
      data: { link, title, body },
      include: {
        user: INCLUDE_SIMPLE_USER,
        publisher: true,
        itemStatus: true,
      },
    })

    ItemService.Algolia.syncItem(updatedItem)

    return updatedItem
  }

  async deleteItem({ itemId, userId }: DeleteItemParams) {
    await ItemService.findItemOrThrow(itemId, userId)
    await db.item.delete({ where: { id: itemId } })
    ItemService.Algolia.deleteItem(itemId)
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
      console.error(`ItemService.ts> getScoredStatusOrNull()`, {
        e,
      })
    }

    return null
  }

  private static async findItemOrThrow(itemId: number, userId: number) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: { user: { select: { id: true } } },
    })
    if (item?.userId !== userId) throw new AppError('Forbidden')
    return item
  }

  private static createPagination<T>(
    list: T[],
    totalCount: number,
    hasNextPage: boolean = false,
    lastCursor: number | null | undefined,
  ) {
    return {
      list,
      totalCount: totalCount,
      pageInfo: {
        hasNextPage,
        lastCursor: lastCursor ?? null,
      },
    }
  }

  private static emptyPagination() {
    return ItemService.createPagination([], 0, false, null)
  }

  private static mergeItemLike(
    item: ItemOrItemWithStatus,
    itemLike?: ItemLike,
  ) {
    return {
      ...item,
      isLiked: !!itemLike ?? false,
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
      const itemMap = await ItemService.Algolia.getSearchedItemByIdMap(itemIds)

      const serializeList = hitsPage.list
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

      return serializeList
    }

    private static async getSearchedItemByIdMap(itemIds: number[]) {
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
}
export default ItemService

// types

type CreateItemParams = ItemsRequestMap['CREATE_ITEM']['Body']

type ItemListPagingOptions = PaginationOptions & {
  mode: ItemsPagingMode
  startDate?: string
  endDate?: string
}

export type ItemsPagingMode = 'recent' | 'trending' | 'past'

type GetItemParams = {
  itemId: number
  userId?: number
}

type ItemOrItemWithStatus = Item | ItemWithStatus

type ItemWithStatus = Item & { itemStatus: ItemStatus | null }

type UpdateItemParams = ItemsRequestMap['UPDATE_ITEM']['Body'] & {
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
