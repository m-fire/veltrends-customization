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
  id: Type.Integer({ default: 1 }),
  username: Type.String({ default: 'test-user' }),
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

export const AUTH_SCHEMA_MAP = createFastifySchemaMap({
  REGISTER: {
    tags: ['auth'],
    body: REQ_AUTH_BODY_SCHEMA,
    response: {
      200: RES_TOKENS_N_USER_SCHEMA,
      409: createAppErrorSchema('UserExistsError'),
    },
  },
  LOGIN: {
    tags: ['auth'],
    body: REQ_AUTH_BODY_SCHEMA,
    response: {
      200: RES_TOKENS_N_USER_SCHEMA,
      401: createAppErrorSchema('AuthenticationError'),
    },
  },
  REFRESH_TOKEN: {
    tags: ['auth'],
    body: REQ_REFRESH_TOKEN_BODY_SCHEMA,
    response: {
      200: RES_TOKENS_SCHEMA,
      400: createAppErrorSchema('BadReqeustError'),
      401: createAppErrorSchema('RefreshFailureError'),
    },
  },
})
