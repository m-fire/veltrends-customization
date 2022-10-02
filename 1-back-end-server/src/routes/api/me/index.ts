import { FastifyPluginAsync } from 'fastify'
import { SCHEMA_ME_GET } from './schema.js'
import AppError from '../../../common/error/AppError.js'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: SCHEMA_ME_GET }, async (request) => {
    /* Todo: 인증된 사용자의 access 마다 인증을 어떤방식으로 처리 할 것인가? */
    // 1. 쿠키/해더 에 포함된 token 값으로 처리-> X: 접속마다 토큰파싱을 해야함.
    // 2. 글로벌 플러그인 적용: `fastify-plugin`-> common/fastify/plugin/auth-plugin.ts

    if (request.isExpiredToken)
      throw new AppError('UnauthorizedError', {
        isExpiredToken: true, // 만료된 토큰이 들어오면, 애러에 만료상태 설정
      })
    if (!request.user)
      throw new AppError('UnauthorizedError', {
        isExpiredToken: false, // 인증정보가 없다면 사용자의 만료토큰 비활성
      })

    return request.user
  })
}

export default meRoute
