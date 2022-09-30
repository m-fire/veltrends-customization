import { SwaggerSchema } from '../config/fastify/types'

export const RES_ERROR_COMMON: SwaggerSchema = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
  },
}
