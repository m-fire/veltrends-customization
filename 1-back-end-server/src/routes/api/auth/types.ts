import { Static } from '@sinclair/typebox'
import AUTH_SCHEMA, {
  REQ_AUTH_BODY_SCHEMA,
  RES_AUTH_USER_INFO_SCHEMA,
} from './schema.js'
import { RouteRequestMap } from '../../../common/config/fastify/types.js'

export type AuthRequestMap = RouteRequestMap<typeof AUTH_SCHEMA>

export interface CookieTokens {
  access_token?: string
  refresh_token?: string
}

export type AuthBody = Static<typeof REQ_AUTH_BODY_SCHEMA>

export type AuthUserInfo = Static<typeof RES_AUTH_USER_INFO_SCHEMA>
