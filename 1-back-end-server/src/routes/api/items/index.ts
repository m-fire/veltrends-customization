import { FastifyPluginAsyncTypebox } from '../../../core/config/fastify/types.js'
import { createAuthRoute } from '../../../core/config/fastify/plugin/auth-plugins.js'
import ItemService from '../../../service/ItemService.js'
import { ListMode } from '../../../core/pagination/types.js'
import ItemsSchema from './schema.js'
import { commentsRoute } from './comments/index.js'
import { Validator } from '../../../common/util/validates.js'

const itemsRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    { schema: ItemsSchema.GetItemList },
    async (request, reply) => {
      const {
        query: { cursor, mode, startDate, endDate },
        user,
      } = request
      /* 파싱 후에도 cursor 가 0 인 경우, undefined 처리 */
      const cursorOrUndefined = cursor
        ? parseInt(cursor, 10) || undefined
        : undefined

      const itemList = await ItemService.getItemList({
        mode: mode as ListMode,
        cursor: cursorOrUndefined,
        userId: user?.id,
        startDate,
        endDate,
      })
      return itemList
    },
  )

  fastify.get(
    '/:id',
    { schema: ItemsSchema.GetItem },
    async (request, reply) => {
      const {
        params: { id },
        user,
      } = request
      const item = await ItemService.getItem({ itemId: id, userId: user?.id })
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
  //
  fastify.post(
    '/',
    { schema: ItemsSchema.CreateItem },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const createItemBody = request.body

      const newItem = await ItemService.createItem(userId, createItemBody)
      reply.status(201)
      return newItem
    },
  )

  fastify.patch(
    '/:id',
    { schema: ItemsSchema.EditItem },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const {
        params: { id: itemId },
        body,
      } = request

      const updatedItem = await ItemService.editItem({
        ...body,
        itemId,
        userId,
      })
      reply.status(202)
      return updatedItem
    },
  )

  fastify.delete(
    '/:id',
    { schema: ItemsSchema.DeleteItem },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const itemId = request.params.id

      await ItemService.deleteItem({ itemId, userId })
      reply.status(204)
    },
  )

  // Item Like process
  fastify.post(
    '/:id/likes',
    { schema: ItemsSchema.LikeItem },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const itemId = request.params.id

      const itemStatus = await ItemService.likeItem({ itemId, userId })
      reply.status(202)
      return { id: itemId, itemStatus, isLiked: true }
    },
  )

  // Item Unlike process
  fastify.delete(
    '/:id/likes',
    { schema: ItemsSchema.UnlikeItem },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { id: itemId } = request.params

      const itemStatus = await ItemService.unlikeItem({ itemId, userId })
      reply.status(202)
      return { id: itemId, itemStatus, isLiked: false }
    },
  )
})
