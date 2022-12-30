import { Bookmark } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import AppError from '../common/error/AppError.js'
import { createEmptyPage, createPage } from '../core/util/paginations.js'
import ItemService from './ItemService.js'
import ItemRepository from '../repository/ItemRepository.js'

class BookmarkService {
  static async mark({ itemId, userId }: MarkParams) {
    try {
      const newBookmark = await db.bookmark.create({
        data: { userId, itemId },
        include: {
          item: {
            include: IR.Query.includeFullRelations(userId),
          },
        },
      })

      const serializedBookmark = ItemService.serialize(newBookmark.item)
      return serializedBookmark
    } catch (e) {
      /* 연관 릴레이션 키 매칭실패 애러인 경우, AppError 로 re-throw */
      if ((e as any)?.message?.includes(['Unique constraint failed'])) {
        throw new AppError('AlreadyExists')
      }
      throw e
    }
  }

  static async unmark({ bookmarkId, userId }: UnmarkParams) {
    await BS.findBookmarkOrThrow({ bookmarkId, userId })
    await db.bookmark.delete({ where: { id: bookmarkId } })
  }

  static async getBookmarkList({
    userId,
    cursor,
    limit,
  }: GetBookmarkListParams) {
    const cursorCreatedAt = await BS.getCreatedAtById(cursor)

    const [totalCount, bookmarkWithItemList] = await Promise.all([
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

    const serializedBookmarkList = bookmarkWithItemList.map((bookmark) => ({
      ...bookmark,
      item: ItemService.serialize(bookmark.item),
    }))

    const lastBookmark = serializedBookmarkList.at(-1)
    const hasLessThanCreatedAt = await BS.hasLessThanCreateAt(lastBookmark)
    const lastCursor = lastBookmark?.id ?? null

    const bookmarkListPage = createPage({
      list: serializedBookmarkList,
      totalCount,
      hasNextPage: hasLessThanCreatedAt,
      lastCursor,
    })
    return bookmarkListPage
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
    bookmarkId,
    userId,
    include,
  }: {
    bookmarkId: number
    userId?: number | null
    include?: Partial<Parameters<typeof db.bookmark.findUnique>[0]['include']>
  }) {
    const bookmark = await db.bookmark.findUnique({
      where: { id: bookmarkId },
      include,
    })

    // userId 를 비교해야 한다면, 반드시 bookmark.userId 와 동일해야 한다.
    if (userId != null && bookmark?.userId !== userId)
      throw new AppError('Forbidden')

    if (bookmark == null) throw new AppError('NotFound')

    return bookmark
  }

  private static async countBookmark(userId: number) {
    return await db.bookmark.count({ where: { userId } })
  }
}
export default BookmarkService

const IR = ItemRepository
const BS = BookmarkService

// types

type MarkParams = { itemId: number; userId: number }

type UnmarkParams = {
  bookmarkId: number
  userId: number
}

type GetBookmarkListParams = {
  userId: number
  cursor?: number | null
  limit: number
}
