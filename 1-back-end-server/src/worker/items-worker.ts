import pLimit from 'p-limit'
import { RankCalculator } from '../core/util/calculates.js'
import ItemStatusService from '../service/ItemStatusService.js'

const itemStatusService = ItemStatusService.getInstance()

const itemsWorker = {
  async updateAllRankingScores() {
    // @todo: increase concurrency after migrating to postresql
    const limitWorker = pLimit(1)
    /* todo: postgresql로 마이그레이션한 후 동시성 증가 확인할것 */

    // const targetStatusList = await this.itemStatusService.getRankTargetList(0.001)
    const targetStatusList = await itemStatusService.getRankTargetStatusList()
    console.log(`items-worker.ts> itemsWorker.updateAllRankingScores()`, {
      'target List size': targetStatusList.length,
    })

    const rankingScoreUpdaters = targetStatusList.map((targetStatus) => {
      return limitWorker(async () => {
        const {
          itemId,
          likeCount,
          item: { createdAt },
        } = targetStatus
        const score = RankCalculator.rankingScore(likeCount, createdAt)
        await itemStatusService.updateScore({ itemId, score })
      })
    })

    await Promise.allSettled(rankingScoreUpdaters)
    console.log(
      `items-worker.ts> itemsWorker.updateAllRankingScores() successfully!`,
    )
  },
}
