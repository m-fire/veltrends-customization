import { ItemLike } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import ItemStatusService from './ItemStatusService.js'

class ItemLikeService {
  private static instance: ItemLikeService
  private itemStatusService = ItemStatusService.getInstance()

  static getInstance() {
    if (!ItemLikeService.instance) {
      ItemLikeService.instance = new ItemLikeService()
    }
    return ItemLikeService.instance
  }

  private constructor() {}

  async like({ itemId, userId }: LikeItemParams) {
    const alreadyLiked = await db.itemLike.findUnique({
      where: { itemId_userId: { itemId, userId } },
    })
    // 사용자가 like 하지 않았다면,
    if (!alreadyLiked) {
      try {
        // itemStatus.likes 를 생성하고,
        await db.itemLike.create({ data: { itemId, userId } })
        // like 했다면(이미 존재), like 생성오류 무시
      } catch (e) {}
    }
    return this.getItemStatus(itemId)
  }

  async unlike({ itemId, userId }: UnlikeItemParams) {
    try {
      await db.itemLike.delete({
        where: { itemId_userId: { itemId, userId } },
      })
    } catch (e) {}
    return this.getItemStatus(itemId)
  }

  private async getItemStatus(itemId: number) {
    const likes = await db.itemLike.count({ where: { itemId } })
    const status = await this.itemStatusService.updateLikes({ itemId, likes })
    return status
  }

  async itemLikeByIdsMap({ itemIds, userId }: ItemLikeByIdsMapParams) {
    const itemLikeList = await db.itemLike.findMany({
      where: {
        itemId: { in: itemIds },
        userId,
      },
    })

    return itemLikeList.reduce<Record<number, ItemLike>>(
      (itemLikeByIdMap, itemLike) => {
        itemLikeByIdMap[itemLike.itemId] = itemLike
        return itemLikeByIdMap
      },
      {},
    )
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

interface ItemLikeByIdsMapParams {
  itemIds: number[]
  userId: number
}
