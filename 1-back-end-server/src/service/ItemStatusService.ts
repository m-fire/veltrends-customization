import db from '../common/config/prisma/db-client.js'

class ItemStatusService {
  private static instance: ItemStatusService

  static getInstance() {
    if (!ItemStatusService.instance) {
      ItemStatusService.instance = new ItemStatusService()
    }
    return ItemStatusService.instance
  }

  private constructor() {}

  async createItemStatus(itemId: number) {
    const newItemStatus = db.itemStatus.create({
      data: { itemId },
    })
    return newItemStatus
  }

  async updateLikeCount({ itemId, likeCount }: UpdateLikeCountParams) {
    const likeCountedStatus = db.itemStatus.update({
      data: { likeCount },
      where: { itemId },
    })
    return likeCountedStatus
  }

  async updateCommentCount({ itemId, commentCount }: UpdateCommentCountParams) {
    const commentCountedStatus = await db.itemStatus.update({
      where: { itemId },
      data: { commentCount },
    })
    return commentCountedStatus
  }

  async updateScore({ itemId, score }: UpdateScoreParams) {
    const scoredStatus = db.itemStatus.update({
      where: { itemId },
      data: { score },
    })
    return scoredStatus
  }
}
export default ItemStatusService

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
