import { FastifySchema } from 'fastify'
import { errorSchema } from './core/config/typebox/schema-util.js'
import { ERROR_PAYLOAD_UNAUTHORIZED } from './core/config/typebox/schema.js'

export const PING_GET_SCHEMA: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: { type: 'string', example: '`pong` from GET' },
  },
}

export const PING_POST_SCHEMA: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: { type: 'string', example: '`pong✅` from POST' },
    401: errorSchema('Unauthorized', null, ERROR_PAYLOAD_UNAUTHORIZED),
  },
}
