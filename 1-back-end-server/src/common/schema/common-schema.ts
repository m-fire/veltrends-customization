import { Static, TSchema, Type } from '@sinclair/typebox'
import AppError from '../error/AppError.js'

// Routes

export const AUTH_USER_INFO_SCHEMA = Type.Object(
  {
    id: Type.Number(),
    username: Type.String(),
  },
  {
    example: {
      id: 1,
      username: 'test-user',
    },
  },
)
export type AuthUserInfo = Static<typeof AUTH_USER_INFO_SCHEMA>

/* Error Schema Utils */

export function createAppErrorSchema<
  K extends Parameters<typeof AppError.info>[0],
>(name: K, payloadSchema?: TSchema) {
  const errorExample = AppError.info(name)
  return Type.Object(
    {
      name: Type.String(),
      message: Type.String(),
      statusCode: Type.Number(),
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
