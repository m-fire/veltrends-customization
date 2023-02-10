import { Type } from '@sinclair/typebox'
import {
  errorSchema,
  routeSchemaMap,
} from '../../../core/config/typebox/schema-util.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../core/config/fastify/types.js'

// Reqeust Schema

const REQ_USERNAME_PASSWORD = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

// Response Schema

export const RES_AUTH_USER_INFO = Type.Object({
  id: Type.Integer(),
  username: Type.String(),
})

export const RES_AUTH_TOKENS = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

const RES_AUTH_RESULT = Type.Object({
  tokens: RES_AUTH_TOKENS,
  user: RES_AUTH_USER_INFO,
})

// FastifySchema

const AuthSchema = routeSchemaMap(['auth'], {
  Register: {
    body: REQ_USERNAME_PASSWORD,
    response: {
      200: RES_AUTH_RESULT,
      409: errorSchema('UserExists'),
    },
  },
  Login: {
    body: REQ_USERNAME_PASSWORD,
    response: {
      200: RES_AUTH_RESULT,
      401: errorSchema('Authentication'),
    },
  },
  Logout: {
    response: {
      202: Type.Null(),
    },
  },
  RefreshToken: {
    body: Type.Object({
      refreshToken: Type.String(),
    }),
    response: {
      200: RES_AUTH_TOKENS,
      400: errorSchema('BadRequest'),
      401: errorSchema('RefreshFailure'),
    },
  },
})
export default AuthSchema

// static types

export type AuthRequestMap = RouteRequestMap<typeof AuthSchema>
export type AuthResponseCodeMap = RouteResponseCodeMap<typeof AuthSchema>
