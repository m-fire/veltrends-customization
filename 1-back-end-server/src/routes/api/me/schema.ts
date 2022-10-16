import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import { RES_AUTH_USER_INFO_SCHEMA } from '../auth/schema.js'
import { createAppErrorSchema } from '../../../common/config/typebox/schema-util.js'

export const ME_GET_SCHEMA: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: RES_AUTH_USER_INFO_SCHEMA,
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
