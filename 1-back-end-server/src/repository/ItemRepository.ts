import { Prisma, Publisher } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import { ItemsRequestMap } from '../routes/api/items/types.js'
import AppError from '../common/error/AppError.js'
import { Converts } from '../common/util/converts.js'
import { CursorOrUndefined } from './types.js'
import { validateMatchToUserAndOwner } from '../core/util/validates.js'

// prisma include conditions

class ItemRepository {
  /* Count */

  static async countAllItems() {
    return db.item.count()
  }

  static async countFromCursor(
    { cursor }: CountFromCursorParams,
    orderBy?: PrismaItemOrderBy | PrismaItemOrderBy[],
  ) {
    return await db.item.count({
      where: {
        id: IR.Query.lessThanIdOrUndefined(cursor),
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
          itemId: IR.Query.lessThanIdOrUndefined(cursor),
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
        id: IR.Query.lessThanIdOrUndefined(cursor),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy,
    })
  }

  /* Create */

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
      include: IR.Query.includeItemRelation(userId),
    })
  }

  /* Read list */

  static async findItemListByCursor(
    { cursor, userId, limit }: FindListByCursorParams,
    orderBy: PrismaItemOrderBy | PrismaItemOrderBy[] = { id: 'desc' },
  ) {
    return db.item.findMany({
      where: {
        id: IR.Query.lessThanIdOrUndefined(cursor),
      },
      orderBy,
      include: IR.Query.includeItemRelation(userId),
      take: limit,
    })
  }

  static async findItemListByCursorAndDateRange(
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
        id: IR.Query.lessThanIdOrUndefined(cursor),
        createdAt: {
          gte: Converts.Date.newYyyymmddHhmmss(startDate),
          lte: Converts.Date.newYyyymmddHhmmss(endDate, '23:59:59'),
        },
      },
      orderBy,
      include: IR.Query.includeItemRelation(userId),
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

  /* Read entity */

  static async findItemOrNull<QI extends Prisma.ItemInclude>(
    itemId: number,
    include?: QI,
  ) {
    return (await db.item.findUnique({
      where: { id: itemId },
      include,
    })) as Prisma.ItemGetPayload<{ include: QI }> | null
  }

  static async findItemOrThrow<QI extends Prisma.ItemInclude>(
    itemId: number,
    include?: QI,
  ) {
    const item = await IR.findItemOrNull(itemId, include)
    if (item == null) throw new AppError('NotFound')
    return item
  }

  static async findPartialItemOrNull<QS extends Prisma.ItemSelect>(
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

  /* Update */

  static async updateItem(
    itemId: number,
    { userId, link, title, body, tags }: UpdateItemParams,
  ) {
    const item = await IR.findPartialItemOrNull(itemId, { userId: true })

    validateMatchToUserAndOwner(userId, item?.userId)

    return db.item.update({
      where: { id: itemId },
      data: { link, title, body },
      include: IR.Query.includeItemRelation(userId),
    })
  }

  /* Delete */

  // Item 의경우 Comment 와 달리 기록을 보관하지 않으므로 실제 row 를 삭제한다.
  static async deleteItem({ itemId, userId }: DeleteItemParams) {
    const item = await IR.findPartialItemOrNull(itemId, { userId: true })

    validateMatchToUserAndOwner(userId, item?.userId)

    return db.item.delete({ where: { id: itemId } })
  }

  // Query option

  static Query = class ItemsQueryClause {
    static lessThanIdOrUndefined(cursor: number | undefined) {
      return cursor
        ? Prisma.validator<Prisma.IntFilter>()({ lt: cursor })
        : undefined
    }
    static includeItemRelation(userId: number | undefined) {
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
        itemLikes: userId
          ? { where: { userId }, select: { id: true } }
          : undefined,
        bookmarks: userId
          ? { where: { userId }, select: { id: true } }
          : undefined,
      })
    }
  }
}
export default ItemRepository

const IR = ItemRepository

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

type UpdateItemParams = Pick<
  Prisma.ItemUpdateInput,
  'link' | 'title' | 'body' | 'tags'
> & {
  userId: number
}

type DeleteItemParams = {
  itemId: number
  userId: number
}
