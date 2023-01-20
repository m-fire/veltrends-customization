import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../common/config/typebox/type-util.js'
import {
  createFastifySchemaMap,
  createPaginationSchema,
} from '../../../common/config/typebox/schema-util.js'

export const SEARCH_SCHEMA = createFastifySchemaMap({
  SEARCH: {
    tags: ['search'],
    querystring: Type.Object({
      q: Type.String(),
      offset: Type.Optional(Type.Integer()),
      limit: Type.Optional(Type.Integer()),
    }),
    response: {
      200: createPaginationSchema(
        Type.Object({
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
        }),
      ),
    },
  },
})
