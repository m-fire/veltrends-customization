import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { createAppErrorSchema } from '../../../common/config/typebox/schema-util.js'

// Reqeust Schema

export const REQ_AUTH_BODY_SCHEMA = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export const REQ_REFRESH_TOKEN_BODY_SCHEMA = Type.Required(
  Type.Object({
    refreshToken: Type.String(),
  }),
)

// Response Schema

export const RES_AUTH_USER_INFO_SCHEMA = Type.Object(
  {
    id: Type.Integer(),
    username: Type.String(),
  },
  {
    example: {
      id: 1,
      username: 'test-user',
    },
  },
)

export const RES_TOKENS_SCHEMA = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

export const RES_TOKENS_N_USER_SCHEMA = Type.Object({
  tokens: RES_TOKENS_SCHEMA,
  user: RES_AUTH_USER_INFO_SCHEMA,
})

// FastifySchema

export const REGISTER_SCHEMA: FastifySchema = {
  tags: ['auth'],
  body: REQ_AUTH_BODY_SCHEMA,
  response: {
    200: RES_TOKENS_N_USER_SCHEMA,
    409: createAppErrorSchema('UserExistsError'),
  },
}

export const LOGIN_SCHEMA: FastifySchema = {
  tags: ['auth'],
  body: REQ_AUTH_BODY_SCHEMA,
  response: {
    200: RES_TOKENS_N_USER_SCHEMA,
    401: createAppErrorSchema('AuthenticationError'),
  },
}

export const REFRESH_TOKEN_SCHEMA: FastifySchema = {
  tags: ['auth'],
  body: REQ_REFRESH_TOKEN_BODY_SCHEMA,
  response: {
    200: RES_TOKENS_SCHEMA,
    400: createAppErrorSchema('BadReqeustError'),
    401: createAppErrorSchema('RefreshTokenError'),
  },
}
