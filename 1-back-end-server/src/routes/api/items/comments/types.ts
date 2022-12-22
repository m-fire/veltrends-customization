import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../../common/config/fastify/types.js'
import COMMENTS_SCHEMA from './schema.js'

export type CommentsRequestMap = RouteRequestMap<typeof COMMENTS_SCHEMA>

export type CommentsResponseCodeMap = RouteResponseCodeMap<
  typeof COMMENTS_SCHEMA
>
