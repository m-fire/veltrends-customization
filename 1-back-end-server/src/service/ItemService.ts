import { ItemCreateBody } from '../routes/api/items/types.js'
import db from '../common/config/prisma/db-client.js'

class ItemService {
  private static instance: ItemService

  static getInstance() {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService()
    }
    return ItemService.instance
  }

  private constructor() {}

  async createItem(
    userId: number,
    { title, body, link, tags }: ItemCreateBody,
  ) {
    const newItemWithUser = await db.item.create({
      data: { title, body, link, userId },
      include: { User: true },
    })
    return newItemWithUser
  }

  async getItem(id: number) {
    const itemWithUser = await db.item.findUnique({
      where: { id },
      include: { User: true },
    })
    return itemWithUser
  }
}
export default ItemService
