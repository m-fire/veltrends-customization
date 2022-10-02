import { FastifySchema } from 'fastify'
import {
  APP_ERROR,
  AUTHORIZED_USERINFO,
  composeExample,
  errorExample,
} from '../../../common/schema/common-schema.js'

export const ME_ROOT_GET: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: AUTHORIZED_USERINFO,
    401: composeExample(
      APP_ERROR,
      errorExample('UnauthorizedError', {
        isExpiredToken: true,
      }),
      {
        type: 'object',
        properties: {
          isExpiredToken: { type: 'boolean' },
        },
      },
    ),
  },
}
