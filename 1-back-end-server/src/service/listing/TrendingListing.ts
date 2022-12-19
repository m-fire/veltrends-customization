import db from '../../common/config/prisma/db-client.js'
import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import { ListingParamsOf } from '../../core/pagination/types.js'
import ItemService from '../ItemService.js'

const THRESHOLD_SCORE = 0.001 as const

type TredingItem = Awaited<ReturnType<typeof findTredingList>>[0]

class TrendingListing extends AbstractModeListing<'trending', TredingItem> {
  private static instance: TrendingListing

  static getInstance() {
    if (TrendingListing.instance == null) {
      TrendingListing.instance = new TrendingListing()
    }
    return TrendingListing.instance
  }

  protected async getTotalCount(options: ListingParamsOf<'trending'>) {
    return db.itemStatus.count({
      where: { score: { gte: THRESHOLD_SCORE } },
    })
  }

  protected async findList(options: ListingParamsOf<'trending'>) {
    return findTredingList(options)
  }

  protected async hasNextPage(
    { ltCursor }: ListingParamsOf<'trending'>,
    lastElement?: TredingItem,
  ) {
    const lastElementScore = lastElement?.itemStatus?.score

    const totalPage = await db.item.count({
      where: {
        itemStatus: {
          itemId: { lt: ltCursor || undefined },
          score: {
            gte: THRESHOLD_SCORE,
            lte: lastElementScore,
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

  protected getLastCursorOrNull(lastElement: TredingItem): number | null {
    return lastElement?.id ?? null
  }
}
export default TrendingListing

// db query func

export function findTredingList({
  ltCursor,
  userId,
  limit,
}: {
  ltCursor?: number | null
  userId?: number | null
  limit: number
}) {
  return db.item.findMany({
    where: { id: { lt: ltCursor || undefined } },
    orderBy: [
      { itemStatus: { score: 'desc' } },
      { itemStatus: { itemId: 'desc' } },
    ],
    include: ItemService.queryIncludeRelations(userId),
    take: limit,
  })
}
