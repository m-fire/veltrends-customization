import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
  AUTH_USER_INFO_SCHEMA,
  createAppErrorSchema,
} from '../../../common/schema/common-schema.js'

export const ME_GET_SCHEMA: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: AUTH_USER_INFO_SCHEMA,
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
