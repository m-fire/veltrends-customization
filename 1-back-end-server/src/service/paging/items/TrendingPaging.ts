import db from '../../../common/config/prisma/db-client.js'
import BaseItemsPaging, { PagingParamsOf } from './BaseItemsPaging.js'

const THRESHOLD_SCORE = 0.001 as const

type TredingItem = Awaited<ReturnType<typeof findTredingItemList>>[0]

class TrendingPaging extends BaseItemsPaging<'trending', TredingItem> {
  private static instance: TrendingPaging

  static getInstance() {
    if (TrendingPaging.instance == null) {
      TrendingPaging.instance = new TrendingPaging()
    }
    return TrendingPaging.instance
  }

  protected async totalCount(options: PagingParamsOf<'trending'>) {
    return db.itemStatus.count({
      where: { score: { gte: THRESHOLD_SCORE } },
    })
  }

  protected async pagingList(options: PagingParamsOf<'trending'>) {
    return findTredingItemList(options)
  }

  protected async hasNextPage(
    { ltCursor }: PagingParamsOf<'trending'>,
    lastItem?: TredingItem,
  ) {
    const lastItemScore = lastItem?.itemStatus?.score

    const totalPage = await db.item.count({
      where: {
        itemStatus: {
          itemId: { lt: ltCursor || undefined },
          score: {
            gte: THRESHOLD_SCORE,
            lte: lastItemScore,
          },
        },
      },
      orderBy: [
        { itemStatus: { score: 'desc' } },
        { itemStatus: { itemId: 'desc' } },
      ],
    })
    return totalPage > 0
  }

  protected getLastCursorOrNull(lastItem: TredingItem): number | null {
    return lastItem?.id ?? null
  }
}
export default TrendingPaging

// db query func

export function findTredingItemList({
  ltCursor,
  limit,
}: {
  ltCursor?: number | null
  limit: number
}) {
  return db.item.findMany({
    where: { id: { lt: ltCursor || undefined } },
    orderBy: [
      { itemStatus: { score: 'desc' } },
      { itemStatus: { itemId: 'desc' } },
    ],
    include: {
      user: { select: { id: true, username: true } },
      itemStatus: {
        select: {
          id: true,
          likeCount: true,
          score: true,
        },
      },
      publisher: true,
    },
    take: limit,
  })
}
