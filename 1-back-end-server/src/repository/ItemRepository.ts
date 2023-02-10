import { Prisma, Publisher } from '@prisma/client'
import db from '../core/config/prisma/index.js'
import AppError from '../common/error/AppError.js'
import { Formatters } from '../common/util/formatters.js'
import { CursorOrUndefined } from './types.js'
import { validateMatchUserToOwner } from '../core/util/validates.js'
import { ItemsRequestMap } from '../routes/api/items/schema.js'

class ItemRepository {
  /* Count */

  static async countAllItems() {
    return db.item.count()
  }

  static async countFromCursor<Q extends ItemCountQuery>(
    { cursor }: CountFromCursorParams,
    query?: Q,
  ) {
    return await db.item.count({
      where: {
        id: IR.Query.lessThanIdOrUndefined(cursor),
      },
      ...query,
    })
  }

  static async countScoreRange<Q extends ItemCountQuery>(
    { cursor, maxScore, minScore }: CountItemByScoreRangeParams,
    query: Q,
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
      ...query,
    })
  }

  static async countCreatedDateRange<Q extends ItemCountQuery>(
    { cursor, startDate, endDate }: CountItemByDateRangeParams,
    query?: Q,
  ) {
    return db.item.count({
      where: {
        id: IR.Query.lessThanIdOrUndefined(cursor),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      ...query,
    })
  }

  /* Create */

  static async createItem({
    title,
    body,
    link,
    // tags,
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
      include: IR.Query.includePartialRelation(userId),
    })
  }

  /* Read list */

  static async findItemListByCursor<Q extends ItemFindManyQuery>(
    { cursor, userId }: FindListByCursorParams,
    query?: Q,
  ) {
    return db.item.findMany({
      where: {
        id: IR.Query.lessThanIdOrUndefined(cursor),
      },
      ...{
        ...query,
        include: IR.Query.includePartialRelation(userId),
      },
    })
  }

  static async findItemListByCursorAndDateRange<Q extends ItemFindManyQuery>(
    { cursor, userId, startDate, endDate }: FindListByCursorAndDateRangeParams,
    query?: Q,
  ) {
    if (!startDate || !endDate) throw new AppError('BadRequest')

    return db.item.findMany({
      where: {
        id: IR.Query.lessThanIdOrUndefined(cursor),
        createdAt: {
          gte: formatYyyyymmddHhmmss(startDate),
          lte: formatYyyyymmddHhmmss(endDate, '23:59:59'),
        },
      },
      ...{
        ...query,
        include: IR.Query.includePartialRelation(userId),
      },
    })
  }

  static async findItemMapByIds<Q extends ItemFindManyQuery>(
    itemIds: number[],
    query?: Q,
  ) {
    const itemList = (await db.item.findMany({
      where: { id: { in: itemIds } },
      ...{
        ...query,
        select: { ...query?.select, id: true },
      },
    })) as Awaited<
      Prisma.ItemGetPayload<
        Q extends undefined
          ? {
              where: { id: { in: typeof itemIds } }
              select: Q['select'] extends undefined
                ? { id: true }
                : Q['select'] & { id: true }
            }
          : Q & {
              where: { id: { in: typeof itemIds } }
              select: Q['select'] extends undefined
                ? { id: true }
                : Q['select'] & { id: true }
            }
      >[]
    >

    const itemByIdMap = itemList.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<number, (typeof itemList)[0]>)

    return itemByIdMap
  }

  /* Read entity */

  static async findItemOrNull<Q extends ItemFindUniqueQuery>(
    itemId: number,
    query?: Q,
  ) {
    try {
      return db.item.findUnique({
        where: { id: itemId },
        ...query,
      }) as Promise<Prisma.ItemGetPayload<Q & { where: { id: number } }> | null>
    } catch (e) {
      console.error(e)
      return null
    }
  }

  static async findItemOrThrow<Q extends ItemFindUniqueQuery>(
    itemId: number,
    query?: Q,
  ) {
    try {
      const item = await IR.findItemOrNull(itemId, query)
      if (!item) throw new AppError('NotFound')

      return item
    } catch (e) {
      if (e instanceof Prisma.NotFoundError) {
        throw new AppError('NotFound')
      }
      console.error(e)
      throw e
    }
  }

  static async findPartialItemOrNull<Q extends ItemFindUniqueQuery>(
    itemId: number,
    query?: Q,
  ) {
    try {
      const item = await db.item.findUnique({
        where: { id: itemId },
        ...query,
      })
      if (!item) return null

      return item
    } catch (e) {
      if (e instanceof Prisma.NotFoundError) {
        throw new AppError('NotFound')
      } else if (AppError.is(e)) {
        throw e
      }
    }
  }

  /* Update */

  static async updateItem(
    itemId: number,
    { userId, link, title, body, tags }: UpdateItemParams,
  ) {
    const item = await IR.findItemOrNull(itemId)

    if (!validateMatchUserToOwner(userId, item?.userId))
      throw new AppError('Forbidden')

    const updated = await db.item.update({
      where: { id: itemId },
      data: { link, title, body },
      include: IR.Query.includePartialRelation(userId),
    })
    return updated as Required<typeof updated> | never
  }

  /* Delete */

  // Item 의경우 Comment 와 달리 기록을 보관하지 않으므로 실제 row 를 삭제한다.
  static async deleteItem({ itemId, userId }: DeleteItemParams) {
    const item = await IR.findPartialItemOrNull(itemId, {
      select: { userId: true },
    })

    validateMatchUserToOwner(userId, item?.userId)

    return db.item.delete({ where: { id: itemId } })
  }

  // Query option

  static Query = class ItemsQueryClause {
    static lessThanIdOrUndefined(cursor: number | undefined) {
      return cursor
        ? Prisma.validator<Prisma.IntFilter>()({ lt: cursor })
        : undefined
    }

    static includePartialRelation(userId: number | undefined) {
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
        // 주의! 조건 제외는 반드시 `false` 를 대입할 것. 제외하기 위해 undefined 를 대입할 경우,
        // 해당 엔티티의 모든 itemLikes 갯수가 카운트 되므로 예상치 못한 결과로 이어진다.
        itemLikes: userId ? { where: { userId }, select: { id: true } } : false,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
      })
    }
  }
}
export default ItemRepository

const IR = ItemRepository

// utils

const formatYyyyymmddHhmmss = Formatters.Date.yyyymmdd_hhmmss

// types

export type ItemCountQuery = Omit<Prisma.ItemCountArgs, 'where'>
export type ItemFindManyQuery = Omit<Prisma.ItemFindManyArgs, 'where'>
export type ItemFindUniqueQuery = Omit<Prisma.ItemFindUniqueArgs, 'where'>

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

type CreateItemWithPublisherParams = ItemsRequestMap['CreateItem']['Body'] & {
  userId: number
  publisher: Publisher
  thumbnail?: string
  author?: string
}

type FindListByCursorAndDateRangeParams = {
  cursor?: CursorOrUndefined
  userId?: number
  startDate?: string
  endDate?: string
}

type FindListByCursorParams = {
  cursor?: CursorOrUndefined
  userId?: number
}

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
