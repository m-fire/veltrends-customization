import { FastifySchema } from 'fastify'
import { createAppErrorSchema } from './common/schema/common-schema.js'
import { Type } from '@sinclair/typebox'

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
    401: createAppErrorSchema(
      'UnauthorizedError',
      Type.Object(
        {
          isExpiredToken: Type.Boolean(),
        },
        {
          example: {
            isExpiredToken: true,
          },
        },
      ),
    ),
  },
}
