import { RequestGenericInterface } from 'fastify/types/request'

export interface UserAuthInfo {
  username: string
  password: string
}

export interface UserRegisterRequest extends RequestGenericInterface {
  Body: UserAuthInfo
}

export interface UserLoginRequest extends RequestGenericInterface {
  Body: UserAuthInfo
}

export interface RefreshTokenRequest extends RequestGenericInterface {
  Body: { refreshToken?: string }
}
