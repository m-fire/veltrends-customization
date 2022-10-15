import { FastifyPluginAsync } from 'fastify'
import { ME_GET_SCHEMA } from './schema.js'
import { endpointAuthPlugin } from '../../../common/config/fastify/plugin/authentication-plugins.js'

const meRoute: FastifyPluginAsync = async (fastify) => {
  /* 특정 라우트에 인증정보검증 플러그인을 적용함. */
  fastify.register(endpointAuthPlugin) // URI`/api/me` 안에서만 보안검증

  fastify.get('/', { schema: ME_GET_SCHEMA }, async (request) => {
    return request.user
  })
}

export default meRoute
