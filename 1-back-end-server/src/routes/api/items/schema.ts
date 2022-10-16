import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { createAppErrorSchema } from '../../../common/util/schema-util.js'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import { RES_AUTH_USER_INFO_SCHEMA } from '../auth/schema.js'

// Reqeust Schema

export const REQ_ITEM_CREATE_BODY_SCHEMA = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Array(Type.String()),
})

export const REQ_ITEM_READ_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer(),
})

// Response Schema

export const RES_ITEM_SCHEMA = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    body: Type.String(),
    link: Type.String(),
    thumbnail: Nullable(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    User: RES_AUTH_USER_INFO_SCHEMA,
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
      User: RES_AUTH_USER_INFO_SCHEMA.example,
    },
  },
)

// FastifySchema

export const ITEM_CREATE_POST_SCHEMA: FastifySchema = {
  tags: ['item'],
  body: REQ_ITEM_CREATE_BODY_SCHEMA,
  response: {
    201: RES_ITEM_SCHEMA,
    401: createAppErrorSchema('AuthenticationError'),
  },
}

export const ITEM_READ_GET_SCHEMA: FastifySchema = {
  tags: ['item'],
  params: REQ_ITEM_READ_PARAMS_SCHEMA,
  response: {
    201: RES_ITEM_SCHEMA,
    401: createAppErrorSchema('AuthenticationError'),
  },
}
