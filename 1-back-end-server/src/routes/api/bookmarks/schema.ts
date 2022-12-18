import { Type } from '@sinclair/typebox'
import {
  createFastifySchemaMap,
  createPaginationSchema,
} from '../../../common/config/typebox/schema-util.js'
import { RES_EMPTY_LIST_SCHEMA } from '../../../common/config/typebox/common-schema.js'
import { RES_ITEM_SCHEMA } from '../items/schema.js'

// Reqeust Schema

// Response Schema

const RES_BOOKMARK_SCHEMA = Type.Object({
  id: Type.Integer(),
  item: RES_ITEM_SCHEMA,
  createdAt: Type.String(),
})

// FastifySchema

const BOOKMARKS_SCHEMA = createFastifySchemaMap({
  MARK: {
    tags: ['bookmarks'],
    body: Type.Object({
      itemId: Type.Number(),
    }),
    response: {
      201: RES_BOOKMARK_SCHEMA,
    },
  },
  UNMARK: {
    tags: ['bookmarks'],
    params: Type.Object({
      bookmarkId: Type.Number(),
    }),
    response: {
      204: Type.Null(),
    },
  },
  GET_BOOKMARK_LIST: {
    tags: ['bookmarks'],
    querystring: Type.Object({
      cursor: Type.Optional(Type.Integer()),
    }),
    response: {
      200: createPaginationSchema(RES_BOOKMARK_SCHEMA),
      404: RES_EMPTY_LIST_SCHEMA,
    },
  },
})

export default BOOKMARKS_SCHEMA
