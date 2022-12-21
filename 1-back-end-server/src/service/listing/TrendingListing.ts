import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import { ListingParams } from '../../core/pagination/types.js'
import ItemRepository from '../../repository/ItemRepository.js'
import ItemStatusService from '../ItemStatusService.js'

const THRESHOLD_SCORE = 0.001 as const

type TredingItem = Awaited<
  ReturnType<typeof ItemRepository.findListByCursor>
>[0]

class TrendingListing extends AbstractModeListing<TredingItem> {
  private static instance: TrendingListing

  static getInstance() {
    if (TrendingListing.instance == null) {
      TrendingListing.instance = new TrendingListing()
    }
    return TrendingListing.instance
  }

  protected async getTotalCount(options: ListingParams) {
    return ItemStatusService.countScoreRange({
      maxScore: THRESHOLD_SCORE,
    })
  }

  protected async findList(options: ListingParams) {
    return ItemRepository.findListByCursor(options, [
      { itemStatus: { score: 'desc' } },
      { itemStatus: { itemId: 'desc' } },
    ])
  }

  protected async hasNextPage(
    { cursor }: ListingParams,
    lastElement?: TredingItem,
  ) {
    const lastElementScore = lastElement?.itemStatus?.score

    const scoredCount = await ItemRepository.countScoreRange(
      {
        cursor,
        maxScore: THRESHOLD_SCORE,
        minScore: lastElementScore,
      },
      [{ itemStatus: { score: 'desc' } }, { itemStatus: { itemId: 'desc' } }],
    )
    return scoredCount > 0
  }

  protected getLastCursorOrNull(lastElement: TredingItem): number | null {
    return lastElement?.id ?? null
  }
}
export default TrendingListing
