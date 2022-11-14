import { RouteRequestMap } from '../../../common/config/fastify/types.js'
import { ITEMS_SCHEMA_MAP } from './schema.js'

export type ItemsRequestMap = RouteRequestMap<typeof ITEMS_SCHEMA_MAP>
