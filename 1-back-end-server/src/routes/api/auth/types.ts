import AUTH_SCHEMA from './schema.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../common/config/fastify/types.js'

export type AuthRequestMap = RouteRequestMap<typeof AUTH_SCHEMA>
export type AuthResponseCodeMap = RouteResponseCodeMap<typeof AUTH_SCHEMA>
