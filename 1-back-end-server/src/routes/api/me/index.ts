import { FastifyPluginAsync } from 'fastify'
import { ME_SCHEMA } from './schema.js'
import { endpointAuthPlugin } from '../../../common/config/fastify/plugin/auth-plugins.js'
import { MeRequestMap } from './types.js'
import UserService from '../../../service/UserService.js'
import { clearCookie } from '../../../common/config/jwt/cookies'

const meRoute: FastifyPluginAsync = async (fastify) => {
  /* 특정 라우트에 인증정보검증 플러그인을 적용함. */
  fastify.register(endpointAuthPlugin) // URI`/api/me` 안에서만 보안검증

  fastify.get<MeRequestMap['GET_ACCOUNT']>(
    '/',
    { schema: ME_SCHEMA.GET_ACCOUNT },
    async (request) => {
      return request.user?.id!
    },
  )

  fastify.post<MeRequestMap['CHANGE_PASSWORD']>(
    '/change-password',
    { schema: ME_SCHEMA.CHANGE_PASSWORD },
    async (request, reply) => {
      const { oldPassword, newPassword } = request.body
      await UserService.changePassword({
        oldPassword,
        newPassword,
        userId: request.user?.id!,
      })
      reply.statusCode = 202
    },
  )

  fastify.delete<MeRequestMap['UNREGISTER']>(
    '/',
    { schema: ME_SCHEMA.UNREGISTER },
    async (request, reply) => {
      await UserService.unregister(request.user?.id!)
      reply.statusCode = 202
      clearCookie(reply)
    },
  )
}

export default meRoute
