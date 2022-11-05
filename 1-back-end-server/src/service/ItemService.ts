import db from '../common/config/prisma/db-client.js'
import { ItemCreateBody, ItemUpdateBody } from '../routes/api/items/types.js'
import {
  Pagination,
  PaginationOptions,
} from '../common/config/fastify/types.js'
import AppError from '../common/error/AppError.js'
import PublisherService from './PublisherService.js'
import ItemStatusService from './ItemStatusService.js'
import ItemLikeService from './ItemLikeService.js'
import { getOriginItemInfo } from '../common/api/external-items.js'

const LIMIT_PER_FIND = 20

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
    { title, body, link, tags }: ItemCreateBody,
  ) {
    const info = await getOriginItemInfo(link)
    const newPublisher = await this.publisherService.createPublisher({
      domain: info.domain,
      name: info.og.publisher,
      favicon: info.og.favicon,
    })

    const newItem = await db.item.create({
      data: {
        title,
        body,
        link: info.url,
        userId,
        thumbnail: info.og.thumbnail,
        author: info.og.author ?? undefined,
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

    return {
      ...newItem,
      itemStatus: newItemStatus,
    }
  }

  async getItemList({ mode, limit, cursor }: ItemListReadPagingOptions) {
    if (mode !== 'recent') return []

    const [totalCount, list] = await Promise.all([
      db.item.count(),
      this.findItemWithUserListByCursor(cursor, limit),
    ])
    const lastCursor = list.at(-1)?.id ?? null
    const hasNextPage = await this.hasNextPageByCursor(lastCursor)

    return <Pagination<typeof list[0]>>{
      list,
      totalCount,
      pageInfo: { hasNextPage, lastCursor },
    }
  }

  async getItem(id: number) {
    const item = await db.item.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        publisher: true,
        itemStatus: true,
      },
    })

    if (!item) throw new AppError('NotFoundError')
    return item
  }

  private async hasNextPageByCursor(cursor: number | null) {
    if (!cursor) return false
    const totalPage = await db.item.count({
      where: { id: { lt: cursor } },
      orderBy: { createdAt: 'desc' },
    })
    return totalPage > 0
  }

  private async findItemWithUserListByCursor(
    cursor: number | null | undefined,
    limit?: number | null,
  ) {
    return db.item.findMany({
      where: {
        id: cursor ? { lt: cursor } : undefined,
      },
      include: {
        user: { select: { id: true, username: true } },
        publisher: true,
        itemStatus: { select: { id: true, likes: true } },
      },
      take: limit ?? LIMIT_PER_FIND,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async updateItem({ itemId, userId, title, body, tags }: ItemUpdateParams) {
    const existsItem = await this.getItem(itemId)
    if (existsItem.userId !== userId) throw new AppError('ForbiddenError')

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

  async deleteItem({ itemId, userId }: ItemDeleteParams) {
    const existsItem = await this.getItem(itemId)
    if (existsItem.userId !== userId) throw new AppError('ForbiddenError')

    await db.item.delete({ where: { id: itemId } })
  }

  async likeItem({ itemId, userId }: ItemDeleteParams) {
    const itemStatus = await this.itemLikeService.like({ itemId, userId })
    return itemStatus
  }

  async unlikeItem({ itemId, userId }: ItemDeleteParams) {
    const itemStatus = await this.itemLikeService.unlike({ itemId, userId })
    return itemStatus
  }
}
export default ItemService

// types

type ItemListReadPagingOptions = PaginationOptions &
  (
    | { mode: 'trending' | 'recent' }
    | {
        mode: 'past'
        date: string
      }
  )

type ItemUpdateParams = ItemUpdateBody & {
  itemId: number
  userId: number
}

type ItemDeleteParams = {
  itemId: number
  userId: number
}
