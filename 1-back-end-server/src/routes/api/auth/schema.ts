import { Type } from '@sinclair/typebox'
import {
  createAppErrorSchema,
  createFastifySchemaMap,
} from '../../../common/config/typebox/schema-util.js'

// Reqeust Schema

export const REQ_AUTH_BODY_SCHEMA = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

const REQ_REFRESH_TOKEN_BODY_SCHEMA = Type.Required(
  Type.Object({
    refreshToken: Type.String(),
  }),
)

// Response Schema

export const RES_AUTH_USER_INFO_SCHEMA = Type.Object({
  id: Type.Integer(),
  username: Type.String(),
})

export const RES_TOKENS_SCHEMA = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

const RES_TOKENS_N_USER_SCHEMA = Type.Object({
  tokens: RES_TOKENS_SCHEMA,
  user: RES_AUTH_USER_INFO_SCHEMA,
})

// FastifySchema

const AUTH_SCHEMA = createFastifySchemaMap({
  REGISTER: {
    tags: ['auth'],
    body: REQ_AUTH_BODY_SCHEMA,
    response: {
      200: RES_TOKENS_N_USER_SCHEMA,
      409: createAppErrorSchema('UserExists'),
    },
  },
  LOGIN: {
    tags: ['auth'],
    body: REQ_AUTH_BODY_SCHEMA,
    response: {
      200: RES_TOKENS_N_USER_SCHEMA,
      401: createAppErrorSchema('Authentication'),
    },
  },
  LOGOUT: {
    tags: ['auth'],
    response: {
      202: Type.Null(),
    },
  },
  REFRESH_TOKEN: {
    tags: ['auth'],
    body: REQ_REFRESH_TOKEN_BODY_SCHEMA,
    response: {
      200: RES_TOKENS_SCHEMA,
      400: createAppErrorSchema('BadRequest'),
      401: createAppErrorSchema('RefreshFailure'),
    },
  },
})

export default AUTH_SCHEMA
