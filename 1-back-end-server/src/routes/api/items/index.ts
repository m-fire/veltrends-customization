import { FastifyPluginAsync } from 'fastify'
import { ItemCreateRequest } from './types.js'
import { ITEMS_POST_SCHEMA } from './schema.js'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'
import ItemService from '../../../service/ItemService.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (fastify) => {
    return 'GET api/items/index.ts'
  })

  fastify.register(itemsAuthRoute)
}
export default itemsRoute

/* Authentication Route */

/* 이곳에 작성된 엔드포인트 핸들러는 인증접속을 요구함 */
const itemsAuthRoute = createAuthRoute(async (fastify) => {
  const itemService = ItemService.getInstance()

  fastify.post<ItemCreateRequest>(
    '/',
    { schema: ITEMS_POST_SCHEMA },
    ({ body: itemCreateBody, user }, reply) => {
      // 인증 승인이 된 요청이고, user 가 반드시 존재하기 때문에, `!`처리됨.
      const userId = user!.id
      const newItem = itemService.createItem(userId, itemCreateBody)
      reply.statusCode = 201
      return newItem
    },
  )
})
