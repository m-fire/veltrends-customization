import { RequestGenericInterface } from 'fastify/types/request'
import { AuthBody, RefreshTokenBody } from './schema.js'

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
