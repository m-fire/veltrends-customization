import db from '../../common/config/prisma/db-client.js'
import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import { ListingParamsOf } from '../../core/pagination/types.js'

type RecentItem = Awaited<ReturnType<typeof findRecentList>>[0]

class RecentListing extends AbstractModeListing<'recent', RecentItem> {
  private static instance: RecentListing

  static getInstance() {
    if (RecentListing.instance == null) {
      RecentListing.instance = new RecentListing()
    }
    return RecentListing.instance
  }

  protected async getTotalCount(options: ListingParamsOf<'recent'>) {
    return db.item.count()
  }

  protected async findList(options: ListingParamsOf<'recent'>) {
    return findRecentList(options)
  }

  protected async hasNextPage(
    { ltCursor }: ListingParamsOf<'trending'>, // lastElement?: RecentItem,
  ) {
    const totalPage = await db.item.count({
      where: { id: { lt: ltCursor || undefined } },
      orderBy: { createdAt: 'desc' },
    })
    return totalPage > 0
  }

  protected getLastCursorOrNull(lastElement?: RecentItem): number | null {
    return lastElement?.id ?? null
  }
}
export default RecentListing

// db query func

export function findRecentList({
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
        select: {
          id: true,
          likeCount: true,
          commentCount: true,
        },
      },
      publisher: true,
    },
    take: limit,
  })
}
