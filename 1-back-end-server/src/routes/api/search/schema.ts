import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import {
  createFastifySchemaMap,
  createPaginationSchema,
} from '../../../common/config/typebox/schema-util.js'

const REQ_SEARCH_ITEM_QUERYSTRING_SCHEMA = Type.Object({
  q: Type.String({ default: '검색어' }),
  offset: Type.Optional(Type.Integer({ default: 3 })),
  limit: Type.Optional(Type.Integer({ default: 20 })),
})

const RES_SEARCHED_ITEM_SCHEMA = Type.Object({
  id: Type.Number({ default: 20 }),
  title: Type.String({ default: 'test_title' }),
  body: Type.String({ default: 'test_body' }),
  author: Nullable(Type.String({ default: 'test_author' })),
  link: Type.String({ default: 'https://www.example-link.com/' }),
  likeCount: Type.Number({ default: 7 }),
  publisher: Type.Object({
    name: Type.String({ default: 'publisher_name' }),
    favicon: Type.String({ default: 'https://favicon.png' }),
    domain: Type.String({ default: 'www.example.com' }),
  }),
  highlight: Type.Object({
    title: Type.String({ default: 'test <em>검색어</em> title' }),
    body: Type.String({ default: 'test <em>검색어</em> body' }),
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
