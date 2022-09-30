import { SchemaStruct } from '../config/fastify/types'

export const RES_ERROR_COMMON: SchemaStruct = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
  },
}
