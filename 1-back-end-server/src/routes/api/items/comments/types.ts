import { RouteRequestMap } from '../../../../common/config/fastify/types.js'
import { COMMENTS_SCHEMA_MAP } from './schema.js'

export type CommentsRequestMap = RouteRequestMap<typeof COMMENTS_SCHEMA_MAP>
