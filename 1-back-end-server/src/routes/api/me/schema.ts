import { FastifySchema } from 'fastify'
import { RES_AUTH_USER_INFO_SCHEMA } from '../auth/schema.js'
import { createAppErrorSchema } from '../../../common/config/typebox/schema-util.js'
import { ERROR_PAYLOAD_EXPIRED_SCHEMA } from '../../../common/config/typebox/common-schema.js'

export const ME_GET_SCHEMA: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: RES_AUTH_USER_INFO_SCHEMA,
    401: createAppErrorSchema(
      'UnauthorizedError',
      ERROR_PAYLOAD_EXPIRED_SCHEMA,
    ),
  },
}
