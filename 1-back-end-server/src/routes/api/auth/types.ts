import { RequestGenericInterface } from 'fastify/types/request'
import { Static } from '@sinclair/typebox'
import {
  REQ_AUTH_BODY_SCHEMA,
  RES_TOKENS_N_USER_SCHEMA,
  RES_AUTH_USER_INFO_SCHEMA,
  REQ_REFRESH_TOKEN_BODY_SCHEMA,
} from './schema.js'

export interface UserRegisterRequest extends RequestGenericInterface {
  Body: AuthBody
}

export interface UserLoginRequest extends RequestGenericInterface {
  Body: AuthBody
}

export interface RefreshTokenRequest extends RequestGenericInterface {
  Body: RefreshTokenBody
}

export interface CookieTokens {
  access_token?: string
  refresh_token?: string
}

export type AuthBody = Static<typeof REQ_AUTH_BODY_SCHEMA>
export type RefreshTokenBody = Static<typeof REQ_REFRESH_TOKEN_BODY_SCHEMA>

export type AuthUserInfo = Static<typeof RES_AUTH_USER_INFO_SCHEMA>
export type AuthResult = Static<typeof RES_TOKENS_N_USER_SCHEMA>
