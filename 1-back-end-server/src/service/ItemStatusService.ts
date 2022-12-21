import db from '../common/config/prisma/db-client.js'
import { Prisma } from '@prisma/client'

class ItemStatusService {
  static async countScoreRange(
    { maxScore, minScore }: CountStatusByScoreParams,
    orderBy?: PrismaItemStatusOrderBy | PrismaItemStatusOrderBy[],
  ) {
    return db.itemStatus.count({
      where: {
        score: {
          gte: maxScore,
          lte: minScore,
        },
      },
      orderBy,
    })
  }

  static async createItemStatus(itemId: number) {
    const newItemStatus = db.itemStatus.create({
      data: { itemId },
    })
    return newItemStatus
  }

  static async updateLikeCount({ itemId, likeCount }: UpdateLikeCountParams) {
    const likeCountedStatus = db.itemStatus.update({
      data: { likeCount },
      where: { itemId },
    })
    return likeCountedStatus
  }

  static async updateCommentCount({
    itemId,
    commentCount,
  }: UpdateCommentCountParams) {
    const commentCountedStatus = await db.itemStatus.update({
      where: { itemId },
      data: { commentCount },
    })
    return commentCountedStatus
  }

  static async updateScore({ itemId, score }: UpdateScoreParams) {
    const scoredStatus = db.itemStatus.update({
      where: { itemId },
      data: { score },
    })
    return scoredStatus
  }

  static async getRankTargetStatusList(limitScoreFloat?: number) {
    const targetStatusList = await db.itemStatus.findMany({
      where:
        limitScoreFloat != null
          ? { score: { lte: limitScoreFloat } }
          : undefined,
      select: {
        itemId: true,
        likeCount: true,
        item: { select: { createdAt: true } },
      },
    })
    return targetStatusList
  }
}
export default ItemStatusService

const ISS = ItemStatusService

// types

interface UpdateLikeCountParams {
  itemId: number
  likeCount: number
}

interface UpdateCommentCountParams {
  itemId: number
  commentCount: number
}

interface UpdateScoreParams {
  itemId: number
  score: number
}

type CountStatusByScoreParams = { maxScore?: number; minScore?: number }

type PrismaItemStatusOrderBy =
  | Prisma.ItemStatusOrderByWithRelationInput
  | Prisma.ItemStatusOrderByWithAggregationInput
