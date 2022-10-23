import db from '../common/config/prisma/db-client.js'
import { ItemCreateBody, ItemUpdateBody } from '../routes/api/items/types.js'
import {
  Pagination,
  PaginationOptions,
} from '../common/config/fastify/types.js'
import AppError from '../common/error/AppError.js'
import PublisherService from './PublisherService.js'
import { getOriginItemInfo } from '../common/api/external-items.js'

class ItemService {
  private static instance: ItemService
  private publisherService = PublisherService.getInstance()

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

    const newItemWithUser = await db.item.create({
      data: {
        title,
        body,
        link: info.url,
        userId,
        author: info.og.author ?? undefined,
        publisherId: newPublisher.id,
      },
      include: {
        user: { select: { id: true } },
        publisher: true,
      },
    })

    return newItemWithUser
  }

  async getItem(id: number) {
    const itemWithUser = await db.item.findUnique({
      where: { id },
      include: {
        user: { select: { id: true } },
        publisher: true,
      },
    })

    if (!itemWithUser) throw new AppError('NotFoundError')
    return itemWithUser
  }

  async getItemList({ mode, limit, cursor }: ItemListReadPagingOptions) {
    if (mode === 'recent') {
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
    return []
  }

  private async hasNextPageByCursor(cursor: number | null) {
    if (!cursor) return false
    const totalPage = await db.item.count({
      where: { id: { lt: cursor } },
      orderBy: { createdAt: 'desc' },
    })
    return totalPage > 0
  }

  private readonly LIMIT_PER_FIND = 20

  private async findItemWithUserListByCursor(
    cursor: number | null | undefined,
    limit?: number | null,
  ) {
    return db.item.findMany({
      where: {
        id: cursor ? { lt: cursor } : undefined,
      },
      include: {
        user: { select: { id: true } },
        publisher: true,
      },
      take: limit ?? this.LIMIT_PER_FIND,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async updateItem({ itemId, userId, title, body, tags }: ItemUpdateParams) {
    const existsItem = await this.getItem(itemId)
    if (existsItem.userId !== userId) throw new AppError('ForbiddenError')

    const itemWithUser = await db.item.update({
      where: { id: itemId },
      data: { title, body },
      include: {
        user: { select: { id: true } },
        publisher: true,
      },
    })
    return itemWithUser
  }

  async deleteItem({ itemId, userId }: ItemDeleteParams) {
    const existsItem = await this.getItem(itemId)
    if (existsItem.userId !== userId) throw new AppError('ForbiddenError')

    await db.item.delete({ where: { id: itemId } })
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
  userId: number
  itemId: number
}

type ItemDeleteParams = {
  userId: number
  itemId: number
}
