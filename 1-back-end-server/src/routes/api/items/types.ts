import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../common/config/fastify/types.js'
import ITEMS_SCHEMA from './schema.js'

export type ItemsRequestMap = RouteRequestMap<typeof ITEMS_SCHEMA>
export type ItemsResponseCodeMap = RouteResponseCodeMap<typeof ITEMS_SCHEMA>
