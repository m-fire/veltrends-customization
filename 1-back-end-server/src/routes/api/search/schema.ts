import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../core/config/typebox/types.js'
import {
  routeSchemaMap,
  pageSchema,
} from '../../../core/config/typebox/schema-util.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../core/config/fastify/types.js'

// route schema

export const SearchSchema = routeSchemaMap(['search'], {
  Search: {
    querystring: Type.Object({
      q: Type.String(),
      offset: Type.Optional(Type.Integer()),
      limit: Type.Optional(Type.Integer()),
    }),
    response: {
      200: pageSchema(
        Type.Object({
          id: Type.Number(),
          link: Type.String(),
          title: Type.String(),
          body: Type.String(),
          author: Type.String(),
          publisher: Type.Object({
            name: Type.String(),
            favicon: Nullable(Type.String()),
            domain: Type.String(),
          }),
          highlight: Type.Object({
            title: Nullable(Type.String()),
            body: Nullable(Type.String()),
          }),
          likeCount: Type.Number(),
        }),
      ),
    },
  },
})

// static types

export type SearchRequestMap = RouteRequestMap<typeof SearchSchema>

export type SearchResponseCodeMap = RouteResponseCodeMap<typeof SearchSchema>
