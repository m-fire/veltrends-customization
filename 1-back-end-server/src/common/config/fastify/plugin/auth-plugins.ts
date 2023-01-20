import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import jwt from 'jsonwebtoken'
import { AccessTokenPayload, validateToken } from '../../jwt/tokens.js'
import AppError from '../../../error/AppError.js'
import { CookieTokens } from '../../jwt/cookies.js'

const { JsonWebTokenError } = jwt

// 전역 인증용 플러그인

// ref: https://www.fastifyio/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
export const globalAuthPlugin = fp(
  async (fastify, options) => {
    fastify.decorateRequest('user', null)
    fastify.decorateRequest('isExpiredToken', false)

    fastify.addHook('preHandler', async (request) => {
      // 해더 or 쿠키의 인증토큰의 유효성검증 후, 접근여부 처리
      const cookieTokens = request.cookies as CookieTokens
      const tokenStr =
        request.headers.authorization?.split(`Bearer `)[1] ??
        cookieTokens?.access_token

      // 클라이언트에게 refresh_token 만 있다면, access_token 이 expired 된 것.
      if (cookieTokens.refresh_token != null && !tokenStr) {
        request.isExpiredToken = true // 따라서 expired 로 강제변경.
        return
      }

      if (!tokenStr) return

      try {
        const decoded = await validateToken<AccessTokenPayload>(tokenStr)
        request.user = {
          id: decoded.userId,
          username: decoded.username,
        }
      } catch (e) {
        if (e instanceof JsonWebTokenError) {
          if (e.name === 'TokenExpired') {
            // Todo: 만료된 토큰 처리
            // 1. 애러 던지기-> X: 인증이 불필요한 곳에서 애러발생 No!
            // throw new AppError('TokenExpired')
            // 2. FastifyRequest 타입에 추가된 expired 상태 변경
            request.isExpiredToken = true
          }
        }
      }
    })
  },
  {
    name: 'authGlobalPlugin',
  },
)

export function createAuthRoute(plugin: FastifyPluginAsync) {
  const wrappedPlugin: FastifyPluginAsync = async (fastify, opts) => {
    fastify.register(endpointAuthPlugin)
    return plugin(fastify, opts)
  }
  return wrappedPlugin
}

// 특정 엔드포인트 인증용 플러그인

export const endpointAuthPlugin = fp(
  async (fastify, options) => {
    fastify.addHook('preHandler', async (request) => {
      /* Todo: 인증된 사용자의 access 마다 인증을 어떤방식으로 처리 할 것인가? */
      // 1. 쿠키/해더 에 포함된 tokenStr 값을 라우터 마다 처리-> X: 라우터마다 토큰파싱 및 중복코드발생
      // 2. 전역으로 동작하는 글로벌 플러그인을  root path '/' 에 적용
      // 3. 개별적용 플러그인을 만들어, 특정 라우터에만 적용

      if (request.isExpiredToken) {
        throw new AppError('Unauthorized', {
          isExpiredToken: true, // 만료된 토큰이 들어오면, 애러에 만료상태 설정
        })
      }
      if (!request.user) {
        throw new AppError('Unauthorized', {
          isExpiredToken: false, // 인증정보가 없다면 사용자의 만료토큰 비활성
        })
      }
    })
  },
  {
    name: 'authSectionPlugin',
  },
)

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
