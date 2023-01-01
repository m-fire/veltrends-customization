import { Bookmark, Item } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import AppError from '../common/error/AppError.js'
import { createEmptyPage, createPage } from '../core/util/paginations.js'
import ItemService from './ItemService.js'
import ItemRepository from '../repository/ItemRepository.js'
import { validateMatchToUserAndOwner } from '../core/util/validates'

class BookmarkService {
  static async mark({ itemId, userId }: MarkedParams) {
    try {
      const newBookmark = await db.bookmark.create({
        data: { userId, itemId },
        include: {
          item: {
            include: IR.Query.includeFullRelations(userId),
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
    await db.bookmark.delete({ where: { id: itemId } })
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
            include: IR.Query.includeFullRelations(userId),
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ])
    if (totalCount === 0) return createEmptyPage()

    const serializedList = bookmarkList.map((bookmark) =>
      BS.serialize(bookmark),
    )

    const lastBookmark = serializedList.at(-1)
    const hasLessThanCreatedAt = await BS.hasLessThanCreateAt(lastBookmark)
    const lastCursor = lastBookmark?.id ?? null

    const bookmarkListPage = createPage({
      list: serializedList,
      totalCount,
      hasNextPage: hasLessThanCreatedAt,
      lastCursor,
    })
    return bookmarkListPage
  }

  static serialize<T extends Bookmark & { item: Item }>(bookmark: T) {
    return {
      ...bookmark,
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

  private static async findBookmarkOrThrow({
    itemId,
    userId,
    include,
  }: {
    itemId: number
    userId: number
    include?: Partial<Parameters<typeof db.bookmark.findUnique>[0]['include']>
  }) {
    const bookmark = await db.bookmark.findUnique({
      where: { userId_itemId: { itemId, userId } },
      include,
    })
    if (bookmark == null) throw new AppError('NotFound')

    validateMatchToUserAndOwner(userId, bookmark?.userId)

    return bookmark
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
