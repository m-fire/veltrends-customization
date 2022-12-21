import { Prisma, Publisher } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import { ItemsRequestMap } from '../routes/api/items/types.js'
import AppError from '../common/error/AppError.js'
import { Converts } from '../common/util/converts.js'
import { CursorOrUndefined } from './types.js'

// prisma include conditions

class ItemRepository {
  private static instance: ItemRepository

  static getInstance() {
    if (!ItemRepository.instance) {
      ItemRepository.instance = new ItemRepository()
    }
    return ItemRepository.instance
  }

  private constructor() {}

  /* Public APIs */

  // Count

  static async countAllItems() {
    return db.item.count()
  }

  static async countFromCursor(
    { cursor }: CountFromCursorParams,
    orderBy?: PrismaItemOrderBy | PrismaItemOrderBy[],
  ) {
    return await db.item.count({
      where: {
        id: ItemRepository.Query.lessThanIdOrUndefined(cursor),
      },
      orderBy,
    })
  }

  static async countScoreRange(
    { cursor, maxScore, minScore }: CountItemByScoreRangeParams,
    orderBy?: PrismaItemOrderBy | PrismaItemOrderBy[],
  ) {
    return await db.item.count({
      where: {
        itemStatus: {
          itemId: ItemRepository.Query.lessThanIdOrUndefined(cursor),
          score: {
            gte: maxScore,
            lte: minScore,
          },
        },
      },
      orderBy,
    })
  }

  static async countCreatedDateRange(
    { cursor, startDate, endDate }: CountItemByDateRangeParams,
    orderBy?: PrismaItemOrderBy | PrismaItemOrderBy[],
  ) {
    return db.item.count({
      where: {
        id: ItemRepository.Query.lessThanIdOrUndefined(cursor),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy,
    })
  }

  // Create

  static async createItem({
    title,
    body,
    link,
    tags,
    userId,
    publisher,
    author,
    thumbnail,
  }: CreateItemWithPublisherParams) {
    return db.item.create({
      data: {
        title,
        body,
        link,
        // tags,
        userId,
        publisherId: publisher.id,
        thumbnail,
        author,
      },
      include: ItemRepository.Query.includeFullRelations(userId),
    })
  }

  // Read list

  static async findListByCursor(
    { cursor, userId, limit }: FindListByCursorParams,
    orderBy: PrismaItemOrderBy | PrismaItemOrderBy[] = { id: 'desc' },
  ) {
    return db.item.findMany({
      where: {
        id: ItemRepository.Query.lessThanIdOrUndefined(cursor),
      },
      orderBy,
      include: ItemRepository.Query.includeFullRelations(userId),
      take: limit,
    })
  }

  static async findListByCursorAndDateRange(
    {
      cursor,
      userId,
      limit,
      startDate,
      endDate,
    }: FindListByCursorAndDateRangeParams,
    orderBy: PrismaItemOrderBy | PrismaItemOrderBy[] = { id: 'desc' },
  ) {
    if (!startDate || !endDate) throw new AppError('BadRequest')

    return db.item.findMany({
      where: {
        id: ItemRepository.Query.lessThanIdOrUndefined(cursor),
        createdAt: {
          gte: Converts.Date.newYyyymmddHhmmss(startDate),
          lte: Converts.Date.newYyyymmddHhmmss(endDate, '23:59:59'),
        },
      },
      orderBy,
      include: ItemRepository.Query.includeFullRelations(userId),
      take: limit,
    })
  }

  static async findItemMapByIds<QS extends Prisma.ItemSelect>(
    itemIds: number[],
    select?: QS,
  ) {
    const itemList = (await db.item.findMany({
      where: { id: { in: itemIds } },
      select: select ?? { id: true },
    })) as Prisma.ItemGetPayload<{ select: QS }>[]

    const itemByIdMap = itemList.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<number, typeof itemList[0]>)

    return itemByIdMap
  }

  // Read entity

  static async findItemWithRelation(
    itemId: number,
    include?: Prisma.ItemInclude,
  ) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include,
    })
    if (!item) return null

    return item
  }

  static async findItemOrThrow<QI extends Prisma.ItemInclude>(
    { itemId, userId }: FindItemOrThrowParams,
    include?: QI,
  ) {
    const item = (await db.item.findUnique({
      where: { id: itemId },
      include,
    })) as Prisma.ItemGetPayload<{ include: QI }> | null

    // userId 가 없어도 조회가 되지만,
    // userId 를 비교해야 한다면 반드시 item.userId 와 동일해야 한다.
    if (userId != null && item?.userId !== userId)
      throw new AppError('Forbidden')

    if (item == null) throw new AppError('NotFound')

    return item
  }

  static async findPartialItem<QS extends Prisma.ItemSelect>(
    itemId: number,
    select?: QS,
  ) {
    const item = await db.item.findUnique({
      where: { id: itemId },
      select,
    })
    if (!item) return null

    return item as Prisma.ItemGetPayload<{ select: QS }>
  }

  // Update

  static async updateItem({
    itemId,
    userId,
    link,
    title,
    body,
    tags,
  }: UpdateItemParams) {
    await this.findItemOrThrow({ itemId, userId })

    return db.item.update({
      where: { id: itemId },
      data: { link, title, body },
      include: ItemRepository.Query.includeFullRelations(userId),
    })
  }

  // Delete

  static async deleteItem({ itemId, userId }: DeleteItemParams) {
    await this.findItemOrThrow({ itemId, userId })
    return db.item.delete({ where: { id: itemId } })
  }

  // Query option

  static Query = class ItemsQueryClause {
    static lessThanIdOrUndefined(cursor: number | undefined) {
      return cursor
        ? Prisma.validator<Prisma.IntFilter>()({ lt: cursor })
        : undefined
    }
    static includeFullRelations(userId: number | undefined) {
      return Prisma.validator<Prisma.ItemInclude>()({
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
      })
    }
  }
}
export default ItemRepository

// types

type CountFromCursorParams = {
  cursor?: CursorOrUndefined
}

type CountItemByScoreRangeParams = {
  cursor?: CursorOrUndefined
  maxScore?: number
  minScore?: number
}

type CountItemByDateRangeParams = {
  cursor?: CursorOrUndefined
  startDate?: Date
  endDate?: Date
}

type CreateItemWithPublisherParams = ItemsRequestMap['CREATE_ITEM']['Body'] & {
  userId: number
  publisher: Publisher
  thumbnail?: string
  author?: string
}

type FindListByCursorAndDateRangeParams = {
  cursor?: CursorOrUndefined
  userId?: number
  limit: number
  startDate?: string
  endDate?: string
}

type FindListByCursorParams = {
  cursor?: CursorOrUndefined
  userId?: number
  limit: number
}

type PrismaItemOrderBy =
  | Prisma.ItemOrderByWithRelationInput
  | Prisma.ItemOrderByWithAggregationInput

type FindItemOrThrowParams = {
  itemId: number
  userId?: number
}

type UpdateItemParams = Partial<ItemsRequestMap['EDIT_ITEM']['Body']> & {
  itemId: number
  userId: number
}

type DeleteItemParams = {
  itemId: number
  userId: number
}
