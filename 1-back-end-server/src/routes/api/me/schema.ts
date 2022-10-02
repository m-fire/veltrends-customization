import { FastifySchema } from 'fastify'
import {
  APP_ERROR,
  AUTHORIZED_USERINFO,
  composeExampleWithPayload,
} from '../../../common/schema/common-schema.js'

export const ME_ROOT_GET: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: AUTHORIZED_USERINFO,
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
