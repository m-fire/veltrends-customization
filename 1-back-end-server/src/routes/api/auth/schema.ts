import { FastifySchema } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { createAppErrorSchema } from '../../../common/schema/common-schema.js'

// Typebox Schema

export const AUTH_BODY_SCHEMA = Type.Object({
  username: Type.String(),
  password: Type.String(),
})
export type AuthBody = Static<typeof AUTH_BODY_SCHEMA>

export const AUTH_USER_INFO_SCHEMA = Type.Object(
  {
    id: Type.Number(),
    username: Type.String(),
  },
  {
    example: {
      id: 1,
      username: 'test-user',
    },
  },
)

export const REFRESH_TOKEN_BODY_SCHEMA = Type.Object({
  refreshToken: Type.Optional(Type.String()),
})
export type RefreshTokenBody = Static<typeof REFRESH_TOKEN_BODY_SCHEMA>

const TOKENS_SCHEMA = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

const AUTH_RESULT_SCHEMA = Type.Object({
  tokens: TOKENS_SCHEMA,
  user: AUTH_USER_INFO_SCHEMA,
})
export type AuthResult = Static<typeof AUTH_RESULT_SCHEMA>

// FastifySchema

export const REGISTER_SCHEMA: FastifySchema = {
  tags: ['auth'],
  body: AUTH_BODY_SCHEMA,
  response: {
    200: AUTH_RESULT_SCHEMA,
    409: createAppErrorSchema('UserExistsError'),
  },
}

export const LOGIN_SCHEMA: FastifySchema = {
  tags: ['auth'],
  body: AUTH_BODY_SCHEMA,
  response: {
    200: AUTH_RESULT_SCHEMA,
    401: createAppErrorSchema('AuthenticationError'),
  },
}

export const REFRESH_TOKEN_SCHEMA: FastifySchema = {
  tags: ['auth'],
  body: Type.Required(
    Type.Object({
      refreshToken: Type.String(),
    }),
  ),
  response: {
    200: TOKENS_SCHEMA,
    400: createAppErrorSchema('BadReqeustError'),
    401: createAppErrorSchema('RefreshTokenError'),
  },
}
