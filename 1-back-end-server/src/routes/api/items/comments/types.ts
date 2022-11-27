import { Static } from '@sinclair/typebox'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../../common/config/fastify/types.js'
import COMMENTS_SCHEMA from './schema.js'

export type CommentsRequestMap = RouteRequestMap<typeof COMMENTS_SCHEMA>

export type CommentsResponseMap = RouteResponseCodeMap<typeof COMMENTS_SCHEMA>
