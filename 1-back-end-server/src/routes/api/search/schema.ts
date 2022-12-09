import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import {
  createFastifySchemaMap,
  createPaginationSchema,
} from '../../../common/config/typebox/schema-util.js'

const REQ_SEARCH_ITEM_QUERYSTRING_SCHEMA = Type.Object({
  q: Type.String(),
  offset: Type.Optional(Type.Integer()),
  limit: Type.Optional(Type.Integer()),
})

const RES_SEARCHED_ITEM_SCHEMA = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  body: Type.String(),
  author: Nullable(Type.String()),
  link: Type.String(),
  likeCount: Type.Number(),
  publisher: Type.Object({
    name: Type.String(),
    favicon: Type.String(),
    domain: Type.String(),
  }),
  highlight: Type.Object({
    title: Type.String(),
    body: Type.String(),
  }),
})

/* Fastify Schema */

export const SEARCH_SCHEMA = createFastifySchemaMap({
  SEARCH: {
    tags: ['search'],
    querystring: REQ_SEARCH_ITEM_QUERYSTRING_SCHEMA,
    response: {
      200: createPaginationSchema(RES_SEARCHED_ITEM_SCHEMA),
    },
  },
})
