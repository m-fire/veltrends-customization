import pLimit from 'p-limit'
import cron from 'node-cron'
import { RankCalculator } from '../core/util/calculates.js'
import ItemStatusService from '../service/ItemStatusService.js'

const itemsWorker = {
  async updateAllRankingScores() {
    /* todo: postgresql로 마이그레이션한 후 동시성 증가 확인할것 */
    const limitWorker = pLimit(1)

    // const targetStatusList = await ItemStatusService.getRankTargetList(0.001)
    const targetStatusList = await ItemStatusService.getRankTargetStatusList()
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
        await ItemStatusService.updateScore({ itemId, score })
      })
    })

    await Promise.allSettled(rankingScoreUpdaters)
    console.log(
      `items-worker.ts> itemsWorker.updateAllRankingScores() successfully!`,
    )
  },
}

await itemsWorker.updateAllRankingScores()
// 5 분 반복
cron.schedule('*/5 * * * *', itemsWorker.updateAllRankingScores)
// 10초 반복
// cron.schedule('*/10 * * * * *', itemsWorker.updateAllRankingScore)
