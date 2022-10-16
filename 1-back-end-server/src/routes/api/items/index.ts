import { FastifyPluginAsync } from 'fastify'
import { ItemCreateRequest, ItemReadRequest } from './types.js'
import { ITEM_CREATE_POST_SCHEMA, ITEM_READ_GET_SCHEMA } from './schema.js'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'
import ItemService from '../../../service/ItemService.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.get('/', async (request) => {
    return 'GET api/items/index.ts'
  })

  fastify.get<ItemReadRequest>(
    '/:id',
    { schema: ITEM_READ_GET_SCHEMA },
    async (request) => {
      const { id } = request.params
      const item = await itemService.getItem(id)
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

  fastify.post<ItemCreateRequest>(
    '/',
    { schema: ITEM_CREATE_POST_SCHEMA },
    async ({ body: itemCreateBody, user }, reply) => {
      // 인증 승인이 된 요청이고, user 가 반드시 존재하기 때문에, `!`처리됨.
      const userId = user!.id
      const newItem = await itemService.createItem(userId, itemCreateBody)
      reply.statusCode = 201
      return newItem
    },
  )
})
