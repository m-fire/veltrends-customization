import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import {
  createAppErrorSchema,
  createPaginationSchema,
} from '../../../common/config/typebox/schema-util.js'
import { RES_EMPTY_LIST_SCHEMA } from '../../../common/config/typebox/common-schema.js'

// Reqeust Schema

export const REQ_ITEM_CREATE_BODY_SCHEMA = Type.Object({
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
  link: Type.String({ default: 'https://test.com/test' }),
  tags: Type.Array(Type.String()),
})

export const REQ_ITEM_READ_QUERYSTRING_SCHEMA = Type.Object({
  cursor: Type.Optional(Type.String()),
})

export const REQ_ITEM_READ_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer({ default: 30 }),
})

export const REQ_ITEM_UPDATE_BODY_SCHEMA = Type.Object({
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
})

// Response Schema

export const RES_ITEM_SCHEMA = Type.Object({
  id: Type.Integer({ default: 30 }),
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
  link: Type.String({ default: 'https://test.com/test' }),
  thumbnail: Nullable(Type.String()),
  createdAt: Type.String({ default: '2022-10-15T23:16:21.901Z' }),
  updatedAt: Type.String({ default: '2022-10-15T23:16:21.901Z' }),
  user: Type.Object({
    id: Type.Integer({ default: 12 }),
  }),
})

// FastifySchema

export const ITEM_CREATE_SCHEMA: FastifySchema = {
  tags: ['item'],
  body: REQ_ITEM_CREATE_BODY_SCHEMA,
  response: {
    201: RES_ITEM_SCHEMA,
    401: createAppErrorSchema('AuthenticationError'),
  },
}

export const ITEM_LIST_READ_SCHEMA: FastifySchema = {
  tags: ['item'],
  querystring: REQ_ITEM_READ_QUERYSTRING_SCHEMA,
  response: {
    200: createPaginationSchema(RES_ITEM_SCHEMA),
    404: RES_EMPTY_LIST_SCHEMA,
  },
}

export const ITEM_READ_SCHEMA: FastifySchema = {
  tags: ['item'],
  params: REQ_ITEM_READ_PARAMS_SCHEMA,
  response: {
    200: RES_ITEM_SCHEMA,
    404: createAppErrorSchema('NotFoundError'),
  },
}

export const ITEM_UPDATE_SCHEMA: FastifySchema = {
  tags: ['item'],
  params: REQ_ITEM_READ_PARAMS_SCHEMA,
  body: REQ_ITEM_UPDATE_BODY_SCHEMA,
  response: {
    202: RES_ITEM_SCHEMA,
    403: createAppErrorSchema('ForbiddenError'),
    404: createAppErrorSchema('NotFoundError'),
  },
}
