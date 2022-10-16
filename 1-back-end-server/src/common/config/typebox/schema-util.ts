import { TSchema, Type } from '@sinclair/typebox'
import AppError from '../../error/AppError.js'

export function createAppErrorSchema<
  K extends Parameters<typeof AppError.info>[0],
>(name: K, payloadSchema?: TSchema) {
  const errorExample = AppError.info(name)
  return Type.Object(
    {
      name: Type.String(),
      message: Type.String(),
      statusCode: Type.Integer(),
      ...(payloadSchema && { payload: payloadSchema }),
    },
    errorExample && {
      example: {
        ...errorExample,
        ...{ payload: payloadSchema?.example },
      },
    },
  )
}
