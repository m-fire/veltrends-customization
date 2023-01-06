import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import { ListingParams } from '../../core/pagination/types.js'
import ItemRepository from '../../repository/ItemRepository.js'
import ItemStatusService from '../ItemStatusService.js'

const THRESHOLD_SCORE = 0.001 as const

type TredingItem = Awaited<
  ReturnType<typeof ItemRepository.findItemListByCursor>
>[0]

class TrendingListing extends AbstractModeListing<TredingItem> {
  private static instance: TrendingListing

  static getInstance() {
    if (TL.instance == null) {
      TL.instance = new TrendingListing()
    }
    return TL.instance
  }

  /**
   * 최신 트랜드 아이탬 갯수구하기 또는 더 낮은 트랜드 임계스코어 아이탬 총계 구하기.
   * 기능설명 :
   * - 조회 유효성 검사: 항목이 전혀 없는경우 또는, 최대스코어가 0 인 경우
   * 모든항목의 스코어가 0인 상태이고, 최신 trend 항목이 없는것으로 간주할 수 있다.
   * - 임계값 조정: 최초 임계값으로 갯수가 구해지지 않을 경우 임계값을 낮추어 조회해야 한다.
   * 또한 인기도가 계산된 스코어를 score update 봇이 시간이 지남에 따라 모든항목의 점수가
   * 점차 낮아지도록 update 하기 때문에 아무것도 조회가 되지 않는 시점이 온다. 그러므로
   * 트랜드 임계스코어 수치는 기존의 최대 score 값 보다 낮게 설정되어야 항목조회가 가능해진다.
   * 이 함수는 임계스코어 값을 점진적으로 낮춰 조회하도록 구현되었다.
   * @param limit
   * @protected
   */
  protected async getTotalCount({ limit }: ListingParams) {
    const existingMaxScore = await ISS.getMaxScoreOrNull()
    if (existingMaxScore == null || existingMaxScore === 0) return 0

    return 0
  }

  protected async findList(options: ListingParams) {
    return ItemRepository.findItemListByCursor(options, [
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

const TL = TrendingListing
const ISS = ItemStatusService
