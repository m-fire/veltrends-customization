import { RequestGenericInterface } from 'fastify/types/request'
import { Static } from '@sinclair/typebox'
import {
  AUTH_BODY_SCHEMA,
  AUTH_RESULT_SCHEMA,
  AUTH_USER_INFO_SCHEMA,
  REFRESH_TOKEN_BODY_SCHEMA,
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

export type AuthBody = Static<typeof AUTH_BODY_SCHEMA>
export type AuthUserInfo = Static<typeof AUTH_USER_INFO_SCHEMA>
export type RefreshTokenBody = Static<typeof REFRESH_TOKEN_BODY_SCHEMA>
export type AuthResult = Static<typeof AUTH_RESULT_SCHEMA>
