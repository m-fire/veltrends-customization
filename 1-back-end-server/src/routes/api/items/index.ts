import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'
import ItemService, { ItemListingMode } from '../../../service/ItemService.js'
import { ItemsRequestMap } from './types.js'
import ITEMS_SCHEMA from './schema.js'
import { commentsRoute } from './comments/index.js'
import { Validator } from '../../../common/util/validates.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.get<ItemsRequestMap['GET_ITEM_LIST']>(
    '/',
    { schema: ITEMS_SCHEMA.GET_ITEM_LIST },
    async (request, reply) => {
      const {
        query: { cursor, mode, startDate, endDate },
        user,
      } = request
      /* 파싱 후에도 cursor 가 0 인 경우, undefined 처리 */
      const cursorOrUndefined = cursor
        ? parseInt(cursor, 10) || undefined
        : undefined

      const itemList = await itemService.getItemList({
        mode: mode as ItemListingMode,
        cursor: cursorOrUndefined,
        userId: user?.id,
        startDate,
        endDate,
      })
      return itemList
    },
  )

  fastify.get<ItemsRequestMap['GET_ITEM']>(
    '/:id',
    { schema: ITEMS_SCHEMA.GET_ITEM },
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
    { schema: ITEMS_SCHEMA.CREATE_ITEM },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const createItemBody = request.body

      const newItem = await itemService.createItem(userId, createItemBody)
      reply.statusCode = 201
      return newItem
    },
  )

  fastify.patch<ItemsRequestMap['UPDATE_ITEM']>(
    '/:id',
    { schema: ITEMS_SCHEMA.UPDATE_ITEM },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const {
        params: { id: itemId },
        body,
      } = request

      const updatedItem = await itemService.updateItem({
        ...body,
        itemId,
        userId,
      })
      reply.statusCode = 202
      return updatedItem
    },
  )

  fastify.delete<ItemsRequestMap['DELETE_ITEM']>(
    '/:id',
    { schema: ITEMS_SCHEMA.DELETE_ITEM },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const itemId = request.params.id

      await itemService.deleteItem({ itemId, userId })
      reply.statusCode = 204
    },
  )

  // Item Like process
  fastify.post<ItemsRequestMap['LIKE_ITEM']>(
    '/:id/likes',
    { schema: ITEMS_SCHEMA.LIKE_ITEM },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const itemId = request.params.id

      const itemStatus = await itemService.likeItem({ itemId, userId })
      reply.statusCode = 202
      return { id: itemId, itemStatus, isLiked: true }
    },
  )

  // Item Unlike process
  fastify.delete<ItemsRequestMap['UNLIKE_ITEM']>(
    '/:id/likes',
    { schema: ITEMS_SCHEMA.UNLIKE_ITEM },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { id: itemId } = request.params

      const itemStatus = await itemService.unlikeItem({ itemId, userId })
      reply.statusCode = 202
      return { id: itemId, itemStatus, isLiked: false }
    },
  )
})
