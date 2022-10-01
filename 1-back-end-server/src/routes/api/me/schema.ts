import { FastifySchema } from 'fastify'
import { SCHEMA_USER } from '../../../common/schema/common-schema.js'

export const SCHEMA_ME_GET: FastifySchema = {
  /* GET 방식은 response 스키마만 정의한다. */
  response: {
    200: SCHEMA_USER,
  },
}
