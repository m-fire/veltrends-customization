import { Item, ItemLike, ItemStatus } from '@prisma/client'
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
      include: {
        user: { select: { id: true, username: true } },
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

    return ItemService.mergeItemLike(
      newItemWithStatus,
      itemLikeByIdsMap?.[newItem.id],
    )
  }

  async getItemList({ mode, limit, cursor, userId }: ItemListPagingOptions) {
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

    return <Pagination<ItemOrItemWithStatus>>{
      list: itemWithLikeList,
      totalCount,
      pageInfo: { hasNextPage, lastCursor },
    }
  }

  async getItem({ itemId, userId }: GetItemParams) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: {
        user: { select: { id: true, username: true } },
        publisher: true,
        itemStatus: true,
      },
    })

    if (!item) throw new AppError('NotFoundError')

    const itemLikeByIdsOrNull = userId
      ? await this.itemLikeService.itemLikeByIdsMap({
          itemIds: [itemId],
          userId,
        })
      : null

    return ItemService.mergeItemLike(item, itemLikeByIdsOrNull?.[itemId])
  }

  async updateItem({ itemId, userId, title, body, tags }: UpdateItemParams) {
    await ItemService.findItemOrThrow(itemId, userId)
    const updatedItem = await db.item.update({
      where: { id: itemId },
      data: { title, body },
      include: {
        user: { select: { id: true, username: true } },
        publisher: true,
        itemStatus: true,
      },
    })
    return updatedItem
  }

  async deleteItem({ itemId, userId }: DeleteItemParams) {
    await ItemService.findItemOrThrow(itemId, userId)
    await db.item.delete({ where: { id: itemId } })
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
        user: { select: { id: true, username: true } },
        publisher: true,
        itemStatus: { select: { id: true, likeCount: true } },
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
    if (item?.userId !== userId) throw new AppError('ForbiddenError')
    return item
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
