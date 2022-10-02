import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import AppError from '../../../error/AppError.js'

const secureAccessAsync: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preHandler', async (request) => {
    /* Todo: 인증된 사용자의 access 마다 인증을 어떤방식으로 처리 할 것인가? */
    // 1. 쿠키/해더 에 포함된 token 값을 라우터 마다 처리-> X: 라우터마다 토큰파싱 및 중복코드발생
    // 2. 글로벌 플러그인을 만들어, 특정 라우터에만 적용

    if (request.isExpiredToken) {
      throw new AppError('UnauthorizedError', {
        isExpiredToken: true, // 만료된 토큰이 들어오면, 애러에 만료상태 설정
      })
    }
    if (!request.user) {
      throw new AppError('UnauthorizedError', {
        isExpiredToken: false, // 인증정보가 없다면 사용자의 만료토큰 비활성
      })
    }
  })
}

const secureAccessPlugin = fp(secureAccessAsync, {
  name: 'secureAccessPlugin',
})

export default secureAccessPlugin
