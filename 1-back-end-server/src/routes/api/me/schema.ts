import { Type } from '@sinclair/typebox'
import { RES_AUTH_USER_INFO } from '../auth/schema.js'
import {
  errorSchema,
  routeSchemaMap,
} from '../../../core/config/typebox/schema-util.js'
import { ERROR_PAYLOAD_UNAUTHORIZED } from '../../../core/config/typebox/schema.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../core/config/fastify/types'

const MeSchema = routeSchemaMap(['me'], {
  GetAccount: {
    response: {
      200: RES_AUTH_USER_INFO,
      401: errorSchema('Unauthorized', null, ERROR_PAYLOAD_UNAUTHORIZED),
    },
  },

  ChangePassword: {
    body: Type.Object({
      oldPassword: Type.String(),
      newPassword: Type.String(),
    }),
    response: {
      202: Type.Null(),
      // 새로운 패스워드 양식오류
      400: errorSchema('BadRequest'),
      401: errorSchema('Unauthorized', null, ERROR_PAYLOAD_UNAUTHORIZED),
      // 이전 패스워드 불일치
      403: errorSchema('Forbidden', 'Password does not match'),
    },
  },

  Unregister: {
    response: {
      202: Type.Null(),
    },
  },
})
export default MeSchema

// static types

export type MeRequestMap = RouteRequestMap<typeof MeSchema>
export type MeResponseCodeMap = RouteResponseCodeMap<typeof MeSchema>
