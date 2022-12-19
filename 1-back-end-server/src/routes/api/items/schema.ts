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
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Optional(Type.Array(Type.String())),
})

const REQ_ITEM_LIST_QUERYSTRING_SCHEMA = Type.Object({
  cursor: Type.Optional(Type.String()),
  mode: Type.Optional(Type.String()),
  // limit: 아이탬 갯수는 클라이언트에서 정하지 않도록 함
  startDate: Type.Optional(Type.String()),
  endDate: Type.Optional(Type.String()),
})

const REQ_ITEM_PATH_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer(),
})

const REQ_ITEM_UPDATE_BODY_SCHEMA = Type.Object({
  link: Type.String(),
  title: Type.String(),
  body: Type.String(),
  tags: Type.Array(Type.String()),
})

// Response Schema

const RES_ITEM_STATUS_SCHEMA = Type.Object({
  id: Type.Integer(),
  likeCount: Type.Integer(),
  commentCount: Type.Integer(),
})

export const RES_ITEM_LIKE_UPDATE_BODY_SCHEMA = Type.Object({
  id: Type.Integer(),
  itemStatus: RES_ITEM_STATUS_SCHEMA,
})

export const RES_ITEM_SCHEMA = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  thumbnail: Nullable(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  author: Type.String(),
  user: RES_AUTH_USER_INFO_SCHEMA,
  publisher: Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    domain: Type.String(),
    favicon: Nullable(Type.String()),
  }),
  itemStatus: RES_ITEM_STATUS_SCHEMA,
  /* serialized props */
  isLiked: Type.Boolean(),
  isBookmarked: Type.Boolean(),
})

export const RES_ITEM_LIKE_SCHEMA = Type.Object({
  id: Type.Integer(),
  itemStatus: RES_ITEM_STATUS_SCHEMA,
  isLiked: Type.Boolean(),
})

// FastifySchema

const ITEMS_SCHEMA = createFastifySchemaMap({
  CREATE_ITEM: {
    tags: ['items'],
    body: REQ_ITEM_CREATE_BODY_SCHEMA,
    response: {
      201: RES_ITEM_SCHEMA,
      401: createAppErrorSchema('Authentication'),
    },
  },
  GET_ITEM_LIST: {
    tags: ['items'],
    querystring: REQ_ITEM_LIST_QUERYSTRING_SCHEMA,
    response: {
      200: createPaginationSchema(RES_ITEM_SCHEMA),
      404: RES_EMPTY_LIST_SCHEMA,
    },
  },
  GET_ITEM: {
    tags: ['items'],
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_ITEM_SCHEMA,
      404: createAppErrorSchema('NotFound'),
    },
  },
  EDIT_ITEM: {
    tags: ['items'],
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    body: REQ_ITEM_UPDATE_BODY_SCHEMA,
    response: {
      202: RES_ITEM_SCHEMA,
      403: createAppErrorSchema('Forbidden'),
      404: createAppErrorSchema('NotFound'),
    },
  },
  DELETE_ITEM: {
    tags: ['items'],
    params: REQ_ITEM_PATH_PARAMS_SCHEMA,
    response: {
      204: Type.Null(),
      400: createAppErrorSchema('BadRequest'),
      403: createAppErrorSchema('Forbidden'),
      404: createAppErrorSchema('NotFound'),
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
