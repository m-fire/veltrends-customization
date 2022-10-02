import { SchemaStruct, AnySchema } from '../config/fastify/types.js'

// Routes

export const SCHEMA_USER: SchemaStruct = {
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

export const SCHEMA_APP_ERROR: SchemaStruct = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
    payload: { type: 'number' },
  },
}

// Requests

export const REQUEST_BODY_USERINFO: SchemaStruct = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
}

// Responses

export const RESPONSE_200_AUTH_RESULT: SchemaStruct = {
  type: 'object',
  properties: {
    token: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
    user: SCHEMA_USER,
  },
}

/* Schema Utils */

export function composeExampleWithPayload<
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
