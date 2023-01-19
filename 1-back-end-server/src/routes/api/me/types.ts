import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../common/config/fastify/types.js'
import { ME_SCHEMA } from './schema.js'

export type MeRequestMap = RouteRequestMap<typeof ME_SCHEMA>
export type MeResponseCodeMap = RouteResponseCodeMap<typeof ME_SCHEMA>
