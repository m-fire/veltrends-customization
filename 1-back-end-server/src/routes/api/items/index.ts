import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'
import ItemService from '../../../service/ItemService.js'
import { ItemsRequestMap } from './types.js'
import { ITEMS_SCHEMA_MAP } from './schema.js'
import { commentsRoute } from './comments/index.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.get<ItemsRequestMap['GET_ITEM_LIST']>(
    '/',
    { schema: ITEMS_SCHEMA_MAP.GET_ITEM_LIST },
    async (request, reply) => {
      const {
        query: { cursor },
        user,
      } = request
      const itemList = await itemService.getItemList({
        mode: 'recent',
        cursor: cursor ? parseInt(cursor, 10) : null,
        userId: user?.id,
      })
      return itemList
    },
  )

  fastify.get<ItemsRequestMap['GET_ITEM']>(
    '/:id',
    { schema: ITEMS_SCHEMA_MAP.GET_ITEM },
    async (request, reply) => {
      const {
        params: { id },
        user,
      } = request
      const item = await itemService.getItem({ itemId: id, userId: user?.id })
      if (!item) reply.statusCode = 404
      return item
    },
  )

  fastify.register(itemsAuthRoute)

  /* Route from 'items/comments/index.ts' */
  fastify.register(commentsRoute, { prefix: '/:id/comments' })
}
export default itemsRoute

/* Authentication Route */

/* 이곳에 작성된 엔드포인트 핸들러는 인증접속을 요구함 */
const itemsAuthRoute = createAuthRoute(async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.post<ItemsRequestMap['CREATE_ITEM']>(
    '/',
    { schema: ITEMS_SCHEMA_MAP.CREATE_ITEM },
    async (request, reply) => {
      const { body, user } = request
      // 인증 승인이 된 요청이고, user 가 반드시 존재하기 때문에, `!`처리됨.
      const userId = user!.id
      const newItem = await itemService.createItem(userId, body)
      reply.statusCode = 201
      return newItem
    },
  )

  fastify.patch<ItemsRequestMap['UPDATE_ITEM']>(
    '/:id',
    { schema: ITEMS_SCHEMA_MAP.UPDATE_ITEM },
    async (request, reply) => {
      const {
        params: { id: itemId },
        body,
        user,
      } = request
      const updatedItem = await itemService.updateItem({
        itemId,
        userId: user!.id,
        ...body,
      })
      reply.statusCode = 202
      return updatedItem
    },
  )

  fastify.delete<ItemsRequestMap['DELETE_ITEM']>(
    '/:id',
    { schema: ITEMS_SCHEMA_MAP.DELETE_ITEM },
    async (request, reply) => {
      const {
        params: { id: itemId },
        user,
      } = request
      await itemService.deleteItem({
        itemId,
        userId: user!.id,
      })
      reply.statusCode = 204
    },
  )

  // Item Like process
  fastify.post<ItemsRequestMap['LIKE_ITEM']>(
    '/:id/likes',
    { schema: ITEMS_SCHEMA_MAP.LIKE_ITEM },
    async (request, reply) => {
      const {
        params: { id: itemId },
        user,
      } = request
      const userId = user!.id
      const itemStatus = await itemService.likeItem({ itemId, userId })
      reply.statusCode = 202
      return { id: itemId, itemStatus, isLiked: true }
    },
  )

  // Item Unlike process
  fastify.delete<ItemsRequestMap['UNLIKE_ITEM']>(
    '/:id/likes',
    { schema: ITEMS_SCHEMA_MAP.UNLIKE_ITEM },
    async (request, reply) => {
      const { id: itemId } = request.params
      const userId = request.user!.id
      const itemStatus = await itemService.unlikeItem({ itemId, userId })
      reply.statusCode = 202
      return { id: itemId, itemStatus, isLiked: false }
    },
  )
})
