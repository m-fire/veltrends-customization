import { RequestGenericInterface } from 'fastify/types/request'

export interface Authentication {
  username: string
  password: string
}

export interface AuthPostRequest extends RequestGenericInterface {
  Body: Authentication
}
