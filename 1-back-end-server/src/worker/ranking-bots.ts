import PQueue from 'p-queue'
import { RankCalculator } from '../core/util/calculates.js'
import ItemStatusService from '../service/ItemStatusService.js'

const itemStatusService = ItemStatusService.getInstance()

const itemsWorker = {
  async updateRankingScores() {
    // @todo: increase concurrency after migrating to postresql
    const rankingWorkers = new PQueue({ concurrency: 1 })

    // const targetStatusList = await this.itemStatusService.getRankTargetList(0.001)
    const targetStatusList = await itemStatusService.getRankTargetStatusList()
    console.log(`ranking-bots.ts> ItemRankingWorker.updateRankingScores()`, {
      'target List size': targetStatusList.length,
    })

    targetStatusList.forEach(({ itemId, likeCount, item: { createdAt } }) => {
      const itemRankingWorker = async () => {
        const score = RankCalculator.rankingScore(likeCount, createdAt)
        await itemStatusService.updateScore({ itemId, score })
      }

      rankingWorkers.add(itemRankingWorker)
    })

    await rankingWorkers.onIdle()
    console.log(
      `ranking-bots.ts> ItemRankingWorker.updateRankingScores successfully!`,
    )
  },
}
