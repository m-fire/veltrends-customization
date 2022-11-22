import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import {
  createAppErrorSchema,
  createFastifySchemaMap,
  createPaginationSchema,
} from '../../../common/config/typebox/schema-util.js'
import { RES_EMPTY_LIST_SCHEMA } from '../../../common/config/typebox/common-schema.js'
import { RES_AUTH_USER_INFO_SCHEMA } from '../auth/schema.js'

// Reqeust Schema

const REQ_ITEM_CREATE_BODY_SCHEMA = Type.Object({
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
  link: Type.String({ default: 'https://test.com/test' }),
  tags: Type.Optional(Type.Array(Type.String())),
})

const REQ_ITEM_LIST_QUERYSTRING_SCHEMA = Type.Object({
  cursor: Type.Optional(Type.String()),
})

const REQ_ITEM_PATH_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer({ default: 30 }),
})

const REQ_ITEM_UPDATE_BODY_SCHEMA = Type.Object({
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
  tags: Type.Array(Type.String()),
})

// Response Schema

const RES_ITEM_STATUS_SCHEMA = Type.Object({
  id: Type.Integer({ default: 1 }),
  likeCount: Type.Integer({ default: 11 }),
  commentCount: Type.Integer({ default: 4 }),
})

export const RES_ITEM_LIKE_UPDATE_BODY_SCHEMA = Type.Object({
  id: Type.Integer({ default: 6 }),
  itemStatus: RES_ITEM_STATUS_SCHEMA,
})

export const RES_ITEM_SCHEMA = Type.Object({
  id: Type.Integer({ default: 30 }),
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
  link: Type.String({ default: 'https://test.com/test' }),
  thumbnail: Nullable(
    Type.String({ default: 'https://image.com/thumbnail.png' }),
  ),
  createdAt: Type.String({ default: '2022-10-15T23:16:21.901Z' }),
  updatedAt: Type.String({ default: '2022-10-15T23:16:21.901Z' }),
  author: Type.String(),
  user: RES_AUTH_USER_INFO_SCHEMA,
  publisher: Type.Object({
    id: Type.Integer({ default: 15 }),
    name: Type.String({ default: 'test_publisher' }),
    domain: Type.String({ default: 'https://test-domain.com/test_api' }),
    favicon: Nullable(
      Type.String({ default: 'https://image.com/favicon.png' }),
    ),
  }),
  itemStatus: RES_ITEM_STATUS_SCHEMA,
  isLiked: Type.Boolean({ default: false }),
})

export const RES_ITEM_LIKE_SCHEMA = Type.Object({
  id: Type.Integer({ default: 22 }),
  itemStatus: RES_ITEM_STATUS_SCHEMA,
  isLiked: Type.Boolean({ default: false }),
})

// FastifySchema

const ITEMS_SCHEMA = createFastifySchemaMap({
  CREATE_ITEM: {
    tags: ['item'],
    body: REQ_ITEM_CREATE_BODY_SCHEMA,
    response: {
      201: RES_ITEM_SCHEMA,
      401: createAppErrorSchema('AuthenticationError'),
    },
  },
  GET_ITEM_LIST: {
    tags: ['item'],
    querystring: REQ_ITEM_LIST_QUERYSTRING_SCHEMA,
    response: {
      200: createPaginationSchema(RES_ITEM_SCHEMA),
      404: RES_EMPTY_LIST_SCHEMA,
    },
  },
  GET_ITEM: {
    tags: ['item'],
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_ITEM_SCHEMA,
      404: createAppErrorSchema('NotFoundError'),
    },
  },
  UPDATE_ITEM: {
    tags: ['item'],
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    body: REQ_ITEM_UPDATE_BODY_SCHEMA,
    response: {
      202: RES_ITEM_SCHEMA,
      403: createAppErrorSchema('ForbiddenError'),
      404: createAppErrorSchema('NotFoundError'),
    },
  },
  DELETE_ITEM: {
    tags: ['item'],
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    response: {
      204: Type.Null(),
      400: createAppErrorSchema('BadReqeustError'),
      403: createAppErrorSchema('ForbiddenError'),
      404: createAppErrorSchema('NotFoundError'),
    },
  },
  LIKE_ITEM: {
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    response: {
      202: RES_ITEM_LIKE_UPDATE_BODY_SCHEMA,
    },
  },
  UNLIKE_ITEM: {
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    response: {
      202: RES_ITEM_LIKE_UPDATE_BODY_SCHEMA,
    },
  },
})

export default ITEMS_SCHEMA
