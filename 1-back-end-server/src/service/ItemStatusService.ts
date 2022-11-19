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

  async updateLikes({ itemId, likes }: ItemLikeUpdateParams) {
    return db.itemStatus.update({
      data: { likes },
      where: { itemId },
    })
  }

  async updateCommentCount({ itemId, commentCount }: UpdateCommentCountParams) {
    const updatedItemStatus = await db.itemStatus.update({
      where: { itemId },
      data: { commentCount },
    })
    return updatedItemStatus
  }
}
export default ItemStatusService

// types

interface ItemLikeUpdateParams {
  itemId: number
  likes: number
}

interface UpdateCommentCountParams {
  itemId: number
  commentCount: number
}
