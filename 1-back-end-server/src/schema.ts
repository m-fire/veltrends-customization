import { FastifySchema } from 'fastify'
import {
  APP_ERROR,
  composeExampleWithPayload,
} from './common/schema/common-schema.js'

export const MAIN_PING_GET: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: { type: 'string', example: '`pong` from GET' },
  },
}

export const MAIN_PING_POST: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: { type: 'string', example: '`pong✅` from POST' },
    401: composeExampleWithPayload(
      APP_ERROR,
      {
        type: 'UnauthorizedError',
        statusCode: 401,
        message: 'Unauthorized',
        payload: {
          isExpiredToken: true,
        },
      },
      {
        type: 'object',
        properties: {
          isExpiredToken: { type: 'boolean' },
        },
      },
    ),
  },
}
