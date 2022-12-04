import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../common/config/fastify/types.js'
import { SEARCH_SCHEMA } from './schema.js'

export type SearchRequestMap = RouteRequestMap<typeof SEARCH_SCHEMA>
export type SearchResponseCodeMap = RouteResponseCodeMap<typeof SEARCH_SCHEMA>
