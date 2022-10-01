import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import { AccessTokenPayload, validateToken } from '../../jwt/tokens.js'

// ref: https://www.fastifyio/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin

const { JsonWebTokenError } = jwt
const BEARER = 'Bearer'

const authPluginAsync: FastifyPluginAsync = async (fastify, options) => {
  fastify.decorateRequest('user', null)
  fastify.decorateRequest('isExpiredToken', false)

  fastify.addHook('preHandler', async (request) => {
    // 인증토큰이 해더에 없는경우 접근불가 처리.
    const { authorization } = request.headers
    if (!authorization || !authorization.includes(BEARER)) {
      return
    }

    // 인증토큰의 만료상태 검증 후, 접근여부 처리
    const token = authorization.split(`${BEARER} `)[1]
    try {
      const decoded = await validateToken<AccessTokenPayload>(token)
      request.user = {
        id: decoded.userId,
        username: decoded.username,
      }
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') {
          // Todo: 만료된 토큰 처리
          // 1. 애러 던지기-> X: 인증이 불필요한 곳에서 애러발생 No!
          // throw new AppError('TokenExpiredError')
          // 2. FastifyRequest 타입에 추가된 expired 상태 변경
          request.isExpiredToken = true
        }
      }
    }
  })
}

const authPlugin = fp(authPluginAsync, {
  name: 'authPlugin',
})

export default authPlugin

// 선언 병합을 사용하여 적절한 fastify 인터페이스에 플러그인 소품 추가
// 여기에 prop 유형이 정의되어 있으면 장식{,Request,Reply}을 호출할 때 값이 유형 검사됩니다.
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
      username: string
    } | null
    isExpiredToken: boolean
  }
}
