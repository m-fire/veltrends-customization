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

// prisma include conditions
const INCLUDE_SIMPLE_USER = { select: { id: true, username: true } } as const
const INCLUDE_SIMPLE_ITEM_STATUS = {
  select: { id: true, likeCount: true },
} as const

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

    const newItemWithStatus = {
      ...newItem,
      itemStatus: newItemStatus,
    }

    const itemLikeByIdsMap = userId
      ? await this.itemLikeService.itemLikeByIdsMap({
          itemIds: [newItem.id],
          userId,
        })
      : null

    ItemService.Algolia.syncItem(newItem)

    return ItemService.mergeItemLike(
      newItemWithStatus,
      itemLikeByIdsMap?.[newItem.id],
    )
  }

  async getItemList({
    mode,
    limit,
    cursor,
    userId,
  }: ItemListPagingOptions): Promise<Pagination<ItemOrItemWithStatus> | []> {
    if (mode !== 'recent') return []

    const [totalCount, itemList] = await Promise.all([
      db.item.count(),
      ItemService.findItemListFromCursor(cursor, limit),
    ])

    const itemLikeByIdsMap = userId
      ? await this.itemLikeService.itemLikeByIdsMap({
          itemIds: itemList.map((item) => item.id),
          userId: userId,
        })
      : null
    const itemWithLikeList = itemList.map((item) =>
      ItemService.mergeItemLike(item, itemLikeByIdsMap?.[item.id]),
    )

    const lastCursor = itemList.at(-1)?.id ?? null
    const hasNextPage = await ItemService.hasNextPageByCursor(lastCursor)

    return {
      list: itemWithLikeList,
      totalCount,
      pageInfo: { hasNextPage, lastCursor },
    }
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

    const itemLikeByIdsOrNull = userId
      ? await this.itemLikeService.itemLikeByIdsMap({
          itemIds: [itemId],
          userId,
        })
      : null

    return ItemService.mergeItemLike(item, itemLikeByIdsOrNull?.[itemId])
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

  /* Item Action methods */

  async likeItem({ itemId, userId }: ItemActionParams) {
    const itemStatus = await this.itemLikeService.like({ itemId, userId })
    return itemStatus
  }

  async unlikeItem({ itemId, userId }: ItemActionParams) {
    const itemStatus = await this.itemLikeService.unlike({ itemId, userId })
    return itemStatus
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

  private static async hasNextPageByCursor(cursor: number | null) {
    if (!cursor) return false
    const totalPage = await db.item.count({
      where: { id: { lt: cursor } },
      orderBy: { createdAt: 'desc' },
    })
    return totalPage > 0
  }

  private static async findItemListFromCursor(
    cursor: number | null | undefined,
    limit?: number | null,
  ) {
    return db.item.findMany({
      where: { id: cursor ? { lt: cursor } : undefined },
      include: {
        user: INCLUDE_SIMPLE_USER,
        publisher: true,
        itemStatus: INCLUDE_SIMPLE_ITEM_STATUS,
      },
      take: limit ?? LIMIT_PER_FIND,
      orderBy: { createdAt: 'desc' },
    })
  }

  private static async findItemOrThrow(itemId: number, userId: number) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: { user: { select: { id: true } } },
    })
    if (item?.userId !== userId) throw new AppError('Forbidden')
    return item
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
      const itemMap = await ItemService.Algolia.getItemByIdMap(itemIds)

      const serializeList = hitsPage.list
        .map((hit) => {
          const item = itemMap[hit.id]
          if (!item) return null

          const searchedItem = {
            id: item.id,
            link: item.link,
            title: item.title,
            body: item.body,
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

    static async getItemByIdMap(itemIds: number[]) {
      const result = await db.item.findMany({
        where: { id: { in: itemIds } },
        include: {
          user: true,
          publisher: true,
          itemStatus: true,
        },
      })

      const itemByIdMap = result.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {} as Record<number, ItemForAlgoliaService>)

      return itemByIdMap
    }
  }
}
export default ItemService

// types

type CreateItemParams = ItemsRequestMap['CREATE_ITEM']['Body']

type ItemListPagingOptions = PaginationOptions &
  (
    | { mode: 'trending' | 'recent' }
    | {
        mode: 'past'
        date: string
      }
  )

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

type ItemForAlgoliaService = ItemWithPatialUser & {
  itemStatus?: ItemStatus | null
}
