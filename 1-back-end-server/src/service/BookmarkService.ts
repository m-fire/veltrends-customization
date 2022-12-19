import { Bookmark, Item, ItemLike } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import AppError from '../common/error/AppError.js'
import { createEmptyPage, createPage } from '../core/util/paginations.js'
import ItemService from './ItemService.js'

class BookmarkService {
  private static instance: BookmarkService
  private itemLikeService = ItemLikeService.getInstance()

  static getInstance() {
    if (!BS.instance) {
      BS.instance = new BookmarkService()
    }
    return BS.instance
  }

  private constructor() {}

  async mark({ itemId, userId }: MarkParams) {
    try {
      const newBookmark = await db.bookmark.create({
        data: { userId, itemId },
        include: {
          item: {
            include: IS.queryIncludeRelations(userId),
          },
        },
      })

      const serializedBookmark = IS.serialize(newBookmark.item)
      return serializedBookmark
    } catch (e) {
      /* 연관 릴레이션 키 매칭실패 애러인 경우, AppError 로 re-throw */
      if ((e as any)?.message?.includes(['Unique constraint failed'])) {
        throw new AppError('AlreadyExists')
      }
      throw e
    }
  }

  async unmark(params: UnmarkParams) {
    await BS.findBookmarkOrThrow(params)
    await db.bookmark.delete({ where: { id: params.bookmarkId } })
  }

  async getBookmarkList({ userId, cursor, limit }: GetBookmarkListParams) {
    const markedCursorDate = await BS.findMarkedDateById(cursor)

    const [totalCount, bookmarkWithItemList] = await Promise.all([
      BS.countBookmark(userId),
      db.bookmark.findMany({
        where: {
          userId,
          createdAt: markedCursorDate ? { lt: markedCursorDate } : undefined,
        },
        include: {
          item: {
            include: IS.queryIncludeRelations(userId),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      }),
    ])
    if (totalCount === 0) return createEmptyPage()

    const serializedBookmarkList = bookmarkWithItemList.map((bookmark) => ({
      ...bookmark,
      item: IS.serialize(bookmark.item),
    }))

    const lastBookmark = serializedBookmarkList.at(-1)
    const hasLessThanCreatedDate = await BS.hasLessThanCreateAt(lastBookmark)
    const lastCursor = lastBookmark?.id ?? null

    const bookmarkListPage = createPage({
      list: serializedBookmarkList,
      totalCount,
      hasNextPage,
      lastCursor,
    })
    return bookmarkListPage
  }

  private static async hasMoreThanCreateDate<T extends Bookmark>(
    bookmark: T | null | undefined,
  ) {
    if (!bookmark) return false
    const count = await db.bookmark.count({
      where: { userId: bookmark.userId, createdAt: { lt: bookmark.createdAt } },
    })
    return count > 0
  }

  static mergeItemLike<T extends BookmarkWithItem>(
    bookmark: T,
    itemLike?: ItemLike,
  ) {
    return {
      ...bookmark,
      item: {
        ...bookmark.item,
        isLiked: itemLike != null,
      },
    }
  }

  private static async findMarkedDateById(
    bookmarkId: number | null | undefined,
  ) {
    if (bookmarkId == null) return null

    const bookmark = await db.item.findUnique({ where: { id: bookmarkId } })
    if (!bookmark) return null

    return bookmark?.createdAt ?? null
  }

  private static async findBookmarkOrThrow({
    bookmarkId,
    userId,
  }: {
    bookmarkId: number
    userId?: number | null
  }) {
    const bookmark = await db.item.findUnique({ where: { id: bookmarkId } })

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

const IS = ItemService
const BS = BookmarkService
export default BookmarkService

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
