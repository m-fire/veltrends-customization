import { Bookmark, Item, Prisma } from '@prisma/client'
import db from '../core/config/prisma/index.js'
import AppError from '../common/error/AppError.js'
import { Pages } from '../core/util/paginations.js'
import ItemService from './ItemService.js'
import ItemRepository from '../repository/ItemRepository.js'
import { validateMatchUserToOwner } from '../core/util/validates.js'
import { TypeMapper } from '../common/util/type-mapper.js'

class BookmarkService {
  static async mark({ itemId, userId }: MarkedParams) {
    try {
      const newBookmark = await db.bookmark.create({
        data: { userId, itemId },
        include: {
          item: {
            include: IR.Query.includePartialRelation(userId),
          },
        },
      })

      const serialized = BS.serialize(newBookmark)
      return serialized
    } catch (e) {
      /* 연관 릴레이션 키 매칭실패 애러인 경우, AppError 로 re-throw */
      if ((e as any)?.message?.includes(['Unique constraint failed'])) {
        throw new AppError('AlreadyExists')
      }
      throw e
    }
  }

  static async unmark({ itemId, userId }: MarkedParams) {
    await BS.findBookmarkOrThrow({ itemId, userId })
    await db.bookmark.delete({ where: { userId_itemId: { itemId, userId } } })
  }

  static async getBookmarkList({
    userId,
    cursor,
    limit,
  }: GetBookmarkListParams) {
    const cursorCreatedAt = await BS.getCreatedAtById(cursor)

    const [totalCount, bookmarkList] = await Promise.all([
      BS.countBookmark(userId),
      db.bookmark.findMany({
        where: {
          userId,
          createdAt:
            cursorCreatedAt != null ? { lt: cursorCreatedAt } : undefined,
        },
        include: {
          item: {
            include: IR.Query.includePartialRelation(userId),
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ])
    if (totalCount === 0) return Pages.emptyPage()

    const lastBookmark = bookmarkList.at(-1)
    const hasLessThanCreatedAt = await BS.hasLessThanCreateAt(lastBookmark)
    const lastCursor = lastBookmark?.id ?? null

    const bookmarkListPage = Pages.createPage({
      list: bookmarkList.map((bookmark) => BS.serialize(bookmark)),
      totalCount,
      hasNextPage: hasLessThanCreatedAt,
      lastCursor,
    })
    return bookmarkListPage
  }

  static serialize<T extends Bookmark & { item: Item }>(bookmark: T) {
    const mappedBookmark = TypeMapper.mapProps(
      bookmark,
      Date,
      (d) => d.toISOString(),
      true,
    )
    return {
      ...mappedBookmark,
      item: IS.serialize(bookmark.item),
    }
  }

  private static async hasLessThanCreateAt<T extends Bookmark>(
    bookmark: T | null | undefined,
  ) {
    if (!bookmark) return false
    const count = await db.bookmark.count({
      where: { userId: bookmark.userId, createdAt: { lt: bookmark.createdAt } },
    })
    return count > 0
  }

  private static async getCreatedAtById(bookmarkId: number | null | undefined) {
    if (bookmarkId == null) return null

    const bookmark = await db.item.findUnique({ where: { id: bookmarkId } })
    if (!bookmark) return null

    return bookmark?.createdAt ?? null
  }

  private static async findBookmarkOrThrow<Q extends Prisma.BookmarkArgs>(
    { itemId, userId }: FindBookmarkOrThrowParams,
    queryArgs?: Q,
  ) {
    const bookmarkOrNull = await db.bookmark.findUnique({
      where: { userId_itemId: { itemId, userId } },
      ...queryArgs,
    })
    if (bookmarkOrNull == null) throw new AppError('NotFound')
    if (!validateMatchUserToOwner(userId, bookmarkOrNull?.userId))
      throw new AppError('Forbidden')

    return bookmarkOrNull as Prisma.BookmarkGetPayload<Q> | never
  }

  private static async countBookmark(userId: number) {
    return await db.bookmark.count({ where: { userId } })
  }
}
export default BookmarkService

const BS = BookmarkService
const IS = ItemService
const IR = ItemRepository

// types

type MarkedParams = { itemId: number; userId: number }

type GetBookmarkListParams = {
  userId: number
  cursor?: number | null
  limit: number
}

type FindBookmarkOrThrowParams = {
  itemId: number
  userId: number
}
