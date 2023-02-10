import { Type } from '@sinclair/typebox'
import {
  pageSchema,
  routeSchemaMap,
} from '../../../core/config/typebox/schema-util.js'
import { RES_EMPTY_LIST_SCHEMA } from '../../../core/config/typebox/schema.js'
import { RES_ITEM } from '../items/schema.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../core/config/fastify/types.js'

// Reqeust Schema

// Response Schema

const RES_BOOKMARK = Type.Object({
  id: Type.Integer(),
  item: RES_ITEM,
  createdAt: Type.String(),
})

// FastifySchema

const BOOKMARKS_SCHEMA = routeSchemaMap(['bookmarks'], {
  Mark: {
    body: Type.Object({
      itemId: Type.Number(),
    }),
    response: {
      201: RES_BOOKMARK,
    },
  },

  Unmark: {
    querystring: Type.Object({
      itemId: Type.Number(),
    }),
    response: {
      204: Type.Null(),
    },
  },

  GetBookmarkList: {
    querystring: Type.Object({
      cursor: Type.Optional(Type.Integer()),
    }),
    response: {
      200: pageSchema(RES_BOOKMARK),
      404: RES_EMPTY_LIST_SCHEMA,
    },
  },
})
export default BOOKMARKS_SCHEMA

// static types

export type BookmarksRequestMap = RouteRequestMap<typeof BOOKMARKS_SCHEMA>
export type BookmarksResponseCodeMap = RouteResponseCodeMap<
  typeof BOOKMARKS_SCHEMA
>
