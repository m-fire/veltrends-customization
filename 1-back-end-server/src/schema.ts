import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { createAppErrorSchema } from './common/config/typebox/schema-util.js'
import { ERROR_UNAUTHORIZED_SCHEMA } from './common/config/typebox/common-schema.js'

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
    401: createAppErrorSchema('Unauthorized', ERROR_UNAUTHORIZED_SCHEMA),
  },
}
