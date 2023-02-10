import { FastifyPluginAsyncTypebox } from '../../../core/config/fastify/types.js'
import MeSchema from './schema.js'
import { endpointAuthPlugin } from '../../../core/config/fastify/plugin/auth-plugins.js'
import UserService from '../../../service/UserService.js'
import { clearCookie } from '../../../core/config/jwt/cookies.js'

const meRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  /* 특정 라우트에 인증정보검증 플러그인을 적용함. */
  // 이것으로 인해, user 는 항상 인증상태를 유지함(항상 데이터가 존재)
  fastify.register(endpointAuthPlugin) // URI`/api/me` 안에서만 보안검증

  fastify.get('/', { schema: MeSchema.GetAccount }, async (request) => {
    return request.user!
  })

  fastify.post(
    '/change-password',
    { schema: MeSchema.ChangePassword },
    async (request, reply) => {
      const { oldPassword, newPassword } = request.body
      await UserService.changePassword({
        oldPassword,
        newPassword,
        userId: request.user?.id!,
      })
      reply.status(202)
    },
  )

  fastify.delete(
    '/',
    { schema: MeSchema.Unregister },
    async (request, reply) => {
      await UserService.unregister(request.user?.id!)
      reply.status(202)
      clearCookie(reply)
    },
  )
}

export default meRoute
