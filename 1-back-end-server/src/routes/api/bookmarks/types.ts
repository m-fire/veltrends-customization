import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../common/config/fastify/types.js'
import BOOKMARKS_SCHEMA from './schema.js'

export type BookmarksRequestMap = RouteRequestMap<typeof BOOKMARKS_SCHEMA>
export type BookmarksResponseCodeMap = RouteResponseCodeMap<
  typeof BOOKMARKS_SCHEMA
>
