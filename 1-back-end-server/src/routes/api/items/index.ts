import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'
import ItemService from '../../../service/ItemService.js'
import {
  ItemsCreateRequest,
  ItemsReadRequest,
  ItemsUpdateRequest,
} from './types.js'
import {
  ITEM_CREATE_SCHEMA,
  ITEM_LIST_READ_SCHEMA,
  ITEM_READ_SCHEMA,
  ITEM_UPDATE_SCHEMA,
} from './schema.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.get<ItemsReadRequest>(
    '/',
    { schema: ITEM_LIST_READ_SCHEMA },
    async ({ query: { cursor } }, reply) => {
      const itemList = await itemService.getItemList({
        mode: 'recent',
        cursor: cursor ? parseInt(cursor, 10) : null,
      })
      return itemList
    },
  )

  fastify.get<ItemsReadRequest>(
    '/:id',
    { schema: ITEM_READ_SCHEMA },
    async ({ params: { id } }, reply) => {
      const item = await itemService.getItem(id)
      if (!item) reply.statusCode = 404
      return item
    },
  )

  fastify.register(itemsAuthRoute)
}
export default itemsRoute

/* Authentication Route */

/* 이곳에 작성된 엔드포인트 핸들러는 인증접속을 요구함 */
const itemsAuthRoute = createAuthRoute(async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.post<ItemsCreateRequest>(
    '/',
    { schema: ITEM_CREATE_SCHEMA },
    async ({ body, user }, reply) => {
      // 인증 승인이 된 요청이고, user 가 반드시 존재하기 때문에, `!`처리됨.
      const userId = user!.id
      const newItem = await itemService.createItem(userId, body)
      reply.statusCode = 201
      return newItem
    },
  )

  fastify.patch<ItemsUpdateRequest>(
    '/:id',
    { schema: ITEM_UPDATE_SCHEMA },
    async ({ params: { id: itemId }, body: { title, body }, user }, reply) => {
      const updatedItem = await itemService.updateItem({
        itemId,
        title,
        body,
        userId: user!.id,
      })
      reply.statusCode = 202
      return updatedItem
    },
  )
})
