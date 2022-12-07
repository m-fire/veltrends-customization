import { DateCalculator } from '../../common/util/calculates.js'

/**
 * 24시간이 지난 항목의 점수를 현저히 떨어뜨릴 목적의 값
 */
const gravity = 1.4 // 1.8

export class RankCalculator {
  /**
   * <h3>좋아요 갯수와 지난시간을 토대로 계산된 score 반환</h3>
   * <ul>
   *     <li>ref: https://medium.com/jp-tech/how-are-popular-ranking-algorithms-such-as-reddit-and-hacker-news-working-724e639ed9f7</li>
   * </ul>
   */
  static rankingScore(likeCount: number, past: Date) {
    const pastHours = DateCalculator.hoursFromNow(past)
    return likeCount / Math.pow(pastHours + 2, gravity)
  }
}
