import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { createAppErrorSchema } from '../../../common/util/schema-util.js'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import { AUTH_USER_INFO_SCHEMA } from '../auth/schema.js'

export const ITEM_CREATE_SCHEMA = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Array(Type.String()),
})

export const ITEM_CREATE_RESULT_SCHEMA = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    body: Type.String(),
    link: Type.String(),
    thumbnail: Nullable(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    User: AUTH_USER_INFO_SCHEMA,
  },
  {
    example: {
      id: 1,
      title: 'test_title',
      body: 'test_body',
      link: 'https://test.com/test',
      thumbnail: null,
      createdAt: '2022-10-15T23:16:21.901Z',
      updatedAt: '2022-10-15T23:16:21.901Z',
      User: AUTH_USER_INFO_SCHEMA.example,
    },
  },
)

export const ITEMS_POST_SCHEMA: FastifySchema = {
  tags: ['item'],
  body: ITEM_CREATE_SCHEMA,
  response: {
    201: ITEM_CREATE_RESULT_SCHEMA,
    401: createAppErrorSchema('AuthenticationError'),
  },
}
