import db from '../core/config/prisma/index.js'
import ItemStatusService from './ItemStatusService.js'

class ItemLikeService {
  static async like({ itemId, userId }: LikeItemParams) {
    const alreadyLiked = await db.itemLike.findUnique({
      where: { itemId_userId: { itemId, userId } },
    })
    // 사용자가 like 하지 않았다면,
    if (!alreadyLiked) {
      try {
        // itemStatus.likeCount 를 생성하고,
        await db.itemLike.create({ data: { itemId, userId } })
        // like 했다면(이미 존재), like 생성오류 무시
      } catch (e) {}
    }
    return this.syncLikeCount(itemId)
  }

  static async unlike({ itemId, userId }: UnlikeItemParams) {
    try {
      await db.itemLike.delete({
        where: { itemId_userId: { itemId, userId } },
      })
    } catch (e) {}
    return this.syncLikeCount(itemId)
  }

  static async countLike(itemId: number) {
    const likeCount = db.itemLike.count({ where: { itemId } })
    return likeCount
  }

  private static async syncLikeCount(itemId: number) {
    const likeCount = await this.countLike(itemId)
    const syncedItemStatus = await ItemStatusService.updateLikeCount({
      itemId,
      likeCount,
    })
    return syncedItemStatus
  }
}
export default ItemLikeService

// types

type LikeItemParams = {
  itemId: number
  userId: number
}

type UnlikeItemParams = {
  itemId: number
  userId: number
}
