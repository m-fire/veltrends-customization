import { RequestGenericInterface } from 'fastify/types/request'

export interface Authentication {
  username: string
  password: string
}

export interface UserRegisterRequest extends RequestGenericInterface {
  Body: Authentication
}

export interface UserLoginRequest extends RequestGenericInterface {
  Body: Authentication
}

export interface RefreshTokenRequest extends RequestGenericInterface {
  Body: { refreshToken?: string }
}
