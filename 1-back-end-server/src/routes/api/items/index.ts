import { FastifyPluginAsync } from 'fastify'
import { ItemWriteRequest } from './types.js'
import { ITEMS_POST_SCHEMA } from './schema.js'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'

const itemsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (fastify) => {
    return 'GET api/items/index.ts'
  })

  fastify.register(itemsAuthRoute)
}
export default itemsRoute

/* Authentication Route */

const itemsAuthRoute = createAuthRoute(async (fastify) => {
  /* 이곳에 작성된 엔드포인트 핸들러는 인증접속을 요구함 */
  fastify.post<ItemWriteRequest>(
    '/',
    { schema: ITEMS_POST_SCHEMA },
    ({ body }) => {
      return body
    },
  )
})
