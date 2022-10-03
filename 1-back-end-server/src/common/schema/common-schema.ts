import { SchemaStruct, AnySchema } from '../config/fastify/types.js'
import AppError, { ErrorPayloadOpt } from '../error/AppError.js'

// Routes

export const AUTHORIZED_USERINFO: SchemaStruct = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
  },
  example: {
    id: 1,
    username: 'exam-user',
  },
}

// Errors

export const APP_ERROR: SchemaStruct = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
    payload: { type: 'object' },
  },
}

// Requests

export const REQUEST_LOGIN_USERINFO: SchemaStruct = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'password'],
}

export const REQUEST_REFRESH_POST: SchemaStruct = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
  },
}

// Responses

export const RESPONSE_AUTH_RESULT: SchemaStruct = {
  type: 'object',
  properties: {
    tokens: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
    user: AUTHORIZED_USERINFO,
  },
}

export const RESPONSE_REFRESH_POST: SchemaStruct = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  },
}

/* Schema Utils */

export function composeExample<
  T extends SchemaStruct,
  Ex extends AnySchema,
  P extends SchemaStruct,
>(target: T, example: Ex, payloadSchema?: P) {
  return {
    ...target,
    properties: {
      ...target.properties,
      ...(payloadSchema && {
        payload: payloadSchema,
      }),
    },
    example,
  }
}

export function errorExample<
  K extends Parameters<typeof AppError.info>[0],
  P extends ErrorPayloadOpt<K>,
>(type: K, payloadSchema?: P) {
  return {
    ...AppError.info(type),
    ...(payloadSchema && {
      payload: payloadSchema,
    }),
  }
}
