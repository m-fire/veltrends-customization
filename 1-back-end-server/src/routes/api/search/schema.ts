import { Type } from '@sinclair/typebox'
import { createFastifySchemaMap } from '../../../common/config/typebox/schema-util.js'

const REQ_SEARCH_QUERYSTRING_SCHEMA = Type.Object({
  q: Type.String({ default: '검색어' }),
  offset: Type.Optional(Type.Integer({ default: 3 })),
  limit: Type.Optional(Type.Integer({ default: 20 })),
})

/* Fastify Schema */

export const SEARCH_SCHEMA = createFastifySchemaMap({
  SEARCH: {
    querystring: REQ_SEARCH_QUERYSTRING_SCHEMA,
  },
})
