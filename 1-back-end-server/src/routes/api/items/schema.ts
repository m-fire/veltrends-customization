import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { createAppErrorSchema } from '../../../common/util/schema-util.js'

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
    thumbnail: Type.Union([Type.String(), Type.Null()]),
    createdAt: Type.String(),
    updatedAt: Type.String(),
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
