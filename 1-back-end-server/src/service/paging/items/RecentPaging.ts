import db from '../../../common/config/prisma/db-client.js'
import BaseItemsPaging, { PagingParamsOf } from './BaseItemsPaging.js'

type RecentItem = Awaited<ReturnType<typeof findRecentItemList>>[0]

class RecentPaging extends BaseItemsPaging<'recent', RecentItem> {
  private static instance: RecentPaging

  static getInstance() {
    if (RecentPaging.instance == null) {
      RecentPaging.instance = new RecentPaging()
    }
    return RecentPaging.instance
  }

  protected async totalCount(options: PagingParamsOf<'recent'>) {
    return db.item.count()
  }

  protected async pagingList(options: PagingParamsOf<'recent'>) {
    return findRecentItemList(options)
  }

  protected async hasNextPage(
    { ltCursor }: PagingParamsOf<'trending'>, // lastItem?: RecentItem,
  ) {
    const totalPage = await db.item.count({
      where: { id: { lt: ltCursor || undefined } },
      orderBy: { createdAt: 'desc' },
    })
    return totalPage > 0
  }

  protected getLastCursorOrNull(lastItem?: RecentItem): number | null {
    return lastItem?.id ?? null
  }
}
export default RecentPaging

// db query func

export function findRecentItemList({
  ltCursor,
  limit,
}: {
  ltCursor?: number | null
  limit: number
}) {
  return db.item.findMany({
    where: { id: { lt: ltCursor || undefined } },
    orderBy: { id: 'desc' },
    include: {
      user: { select: { id: true, username: true } },
      itemStatus: {
        select: { id: true, likeCount: true, commentCount: true },
      },
      publisher: true,
    },
    take: limit,
  })
}
