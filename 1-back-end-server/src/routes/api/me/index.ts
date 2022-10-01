import { FastifyPluginAsync } from 'fastify'
import { SCHEMA_ME_GET } from './schema.js'
import AppError from '../../../common/error/AppError.js'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: SCHEMA_ME_GET }, async (request) => {
    /* Todo: 인증된 사용자의 access 마다 인증을 어떤방식으로 처리 할 것인가? */
    // 1. 쿠키/해더 에 포함된 token 값으로 처리-> X: 접속마다 토큰파싱을 해야함.
    // 2. 글로벌 플러그인 적용: `fastify-plugin`-> common/fastify/plugin/auth-plugin.ts
    if (!request.user) throw new AppError('UnauthorizedError')

    return request.user
  })
}

export default meRoute
