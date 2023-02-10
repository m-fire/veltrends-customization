import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../core/config/typebox/types.js'
import { RES_EMPTY_LIST_SCHEMA } from '../../../core/config/typebox/schema.js'
import { RES_AUTH_USER_INFO } from '../auth/schema.js'
import {
  errorSchema,
  pageSchema,
  routeSchemaMap,
} from '../../../core/config/typebox/schema-util.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../core/config/fastify/types.js'

// Reqeust Schema

const REQ_ITEM_PATH_PARAMS = Type.Object({
  id: Type.Integer(),
})

// Response Schema

const RES_ITEM_STATUS = Nullable(
  Type.Object({
    id: Type.Integer(),
    likeCount: Type.Integer(),
    commentCount: Type.Integer(),
  }),
)
export const RES_UPDATE_STATUS_BODY = Type.Object({
  id: Type.Integer(),
  itemStatus: RES_ITEM_STATUS,
})

export const RES_ITEM = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  body: Type.String(),
  link: Nullable(Type.String()),
  thumbnail: Nullable(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  author: Type.String(),
  user: RES_AUTH_USER_INFO,
  publisher: Type.Object({
    name: Type.String(),
    domain: Type.String(),
    favicon: Nullable(Type.String()),
  }),
  itemStatus: RES_ITEM_STATUS,
  /* serialized props */
  isLiked: Type.Boolean(),
  isBookmarked: Type.Boolean(),
})

// FastifySchema

const Items = routeSchemaMap(['items'], {
  CreateItem: {
    body: Type.Object({
      title: Type.String(),
      body: Type.String(),
      link: Type.String(),
    }),
    response: {
      201: RES_ITEM,
      401: errorSchema('Authentication'),
    },
  },

  GetItemList: {
    querystring: Type.Object({
      cursor: Type.Optional(Type.String()),
      mode: Type.Optional(
        Type.Union([
          Type.Literal('trending'),
          Type.Literal('recent'),
          Type.Literal('past'),
        ]),
      ),
      // limit: 아이탬 갯수는 클라이언트에서 정하지 않도록 함
      startDate: Type.Optional(Type.String()),
      endDate: Type.Optional(Type.String()),
    }),
    response: {
      200: pageSchema(RES_ITEM),
      404: RES_EMPTY_LIST_SCHEMA,
    },
  },

  GetItem: {
    params: REQ_ITEM_PATH_PARAMS,
    response: {
      200: RES_ITEM,
      404: errorSchema('NotFound'),
    },
  },

  EditItem: {
    params: REQ_ITEM_PATH_PARAMS,
    body: Type.Object({
      link: Type.String(),
      title: Type.String(),
      body: Type.String(),
    }),
    response: {
      202: RES_ITEM,
      403: errorSchema('Forbidden'),
      404: errorSchema('NotFound'),
    },
  },

  DeleteItem: {
    params: REQ_ITEM_PATH_PARAMS,
    response: {
      204: Type.Null(),
      400: errorSchema('BadRequest'),
      403: errorSchema('Forbidden'),
      404: errorSchema('NotFound'),
    },
  },

  LikeItem: {
    params: REQ_ITEM_PATH_PARAMS,
    response: {
      202: RES_UPDATE_STATUS_BODY,
    },
  },

  UnlikeItem: {
    params: REQ_ITEM_PATH_PARAMS,
    response: {
      202: RES_UPDATE_STATUS_BODY,
    },
  },
})

export default Items

// static types

export type ItemsRequestMap = RouteRequestMap<typeof Items>

export type ItemsResponseCodeMap = RouteResponseCodeMap<typeof Items>
