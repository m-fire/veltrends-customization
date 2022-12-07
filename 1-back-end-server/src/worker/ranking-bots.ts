import pLimit from 'p-limit'
import { RankCalculator } from '../core/util/calculates.js'
import ItemStatusService from '../service/ItemStatusService.js'

const itemStatusService = ItemStatusService.getInstance()

const itemsWorker = {
  async updateRankingScores() {
    // @todo: increase concurrency after migrating to postresql
    const concurrentLimitWorker = pLimit(1)

    // const targetStatusList = await this.itemStatusService.getRankTargetList(0.001)
    const targetStatusList = await itemStatusService.getRankTargetStatusList()
    console.log(`ranking-bots.ts> ItemRankingWorker.updateRankingScores()`, {
      'target List size': targetStatusList.length,
    })

    const rankingWorkerList = targetStatusList.map((targetStatus) => {
      return concurrentLimitWorker(() => {
        const {
          itemId,
          likeCount,
          item: { createdAt },
        } = targetStatus
        const score = RankCalculator.rankingScore(likeCount, createdAt)
        itemStatusService.updateScore({ itemId, score })
      })
    })

    await Promise.allSettled(rankingWorkerList)
    console.log(`ranking-bots.ts> RankingWorkers all successfully!`)
  },
}
