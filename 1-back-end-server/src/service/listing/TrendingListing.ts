import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import { ListingParams } from '../../core/pagination/types.js'
import ItemRepository from '../../repository/ItemRepository.js'
import ItemStatusService from '../ItemStatusService.js'

const THRESHOLD_SCORE = 0.001
const REDUCE_STEP = 0.1
const MIN_PAGE = 2

type TredingItem = Awaited<ReturnType<typeof IR.findItemListByCursor>>[0]

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
   * - 조회 유효성 검사: 1. 항목이 전혀 없는경우 0 반환. 2. 항목이 존재해도 가장높은 스코어가 0 인 경우
   * 모든항목의 스코어가 0 인 상태이고, 최신 trend 항목이 없는것으로 간주하므로 0 반환.
   * - 임계값 조정: 최초 임계값으로 갯수가 구해지지 않을 경우 임계값을 낮추어 조회해야 한다.
   * 또한 인기도가 계산된 스코어를 score update 봇이 시간이 지남에 따라 모든항목의 점수가
   * 점차 낮아지도록 update 하기 때문에 아무것도 조회가 되지 않는 시점이 온다. 그러므로
   * 트랜드 임계스코어 수치는 기존의 최대 score 값 보다 낮게 설정되어야 항목조회가 가능해진다.
   * 이 함수는 임계스코어 값을 점진적으로 낮춰 조회하도록 구현되었다.
   * @param limit
   * @protected
   */
  protected async getTotalCount({ limit }: ListingParams) {
    const all = await IR.countAllItems()
    if (!all) return 0

    const existingMaxScore = await ISS.getMaxScoreOrNull()
    if (!existingMaxScore) return 0

    // 임계스코어 1차 감소: 임계값을 최대 스코어 값 아래로 하향조정
    let reducedThreshold = THRESHOLD_SCORE
    while (existingMaxScore <= reducedThreshold) {
      reducedThreshold = TL.reduceThreshold(reducedThreshold)
    }

    // 임계스코어 하향 반복검색 조건:
    // 1. 모든 item 수 보다 검색된 trend item 수가 적거나,
    // 2. 검색된 trend item 수가 최소페이지 제한수보다 적어야 한다
    const minPageLimit = limit * MIN_PAGE
    let totalTrends = 0,
      prevTotal = null,
      notEnoughs = 0
    while (totalTrends < all || totalTrends < minPageLimit) {
      // 불충분결과 횟수가 2번이상이면 지금까지 조회된 결과를 그대로 반환
      if (notEnoughs >= 2) return totalTrends

      totalTrends = await ISS.countScoreRange({
        maxScore: reducedThreshold,
      })

      if (totalTrends === prevTotal) notEnoughs++ // 불충분한 결과 카운트
      prevTotal = totalTrends
      // 임계스코어 2차 감소: 아이탬이 없으므로 다시 하양조정
      reducedThreshold = TL.reduceThreshold(reducedThreshold)
    }

    return totalTrends
  }

  protected async findList(options: ListingParams) {
    return IR.findItemListByCursor(options, [
      { itemStatus: { score: 'desc' } },
      { itemStatus: { itemId: 'desc' } },
    ])
  }

  protected async hasNextPage(
    { cursor }: ListingParams,
    lastElement?: TredingItem,
  ) {
    const lastElementScore = lastElement?.itemStatus?.score

    const scoredCount = await IR.countScoreRange(
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

  private static reduceThreshold(reducedThreshold: number) {
    return reducedThreshold * REDUCE_STEP
  }
}
export default TrendingListing

const TL = TrendingListing
const ISS = ItemStatusService
const IR = ItemRepository
