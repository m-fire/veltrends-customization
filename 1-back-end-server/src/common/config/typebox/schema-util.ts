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

export const createPaginationSchema = <T extends TSchema>(
  schema: T,
  // example?: Record<string, any>,
) =>
  Type.Object({
    list: Type.Array(schema),
    totalCount: Type.Integer({ default: 30 }),
    pageInfo: Type.Object(
      {
        hasNextPage: Type.Boolean(),
        lastCursor: Type.Integer({ default: 10 }),
      },
      //todo: 커스텀 예제가 이상하게 동작한다. 알아볼것
      // example
      //   ? { example }
      //   : {
      //       example: {
      //         list: [schema.example],
      //         totalCount: 30,
      //         pageInfo: {
      //           hasNextPage: true,
      //           lastCursor: 10,
      //         },
      //       },
      //     },
    ),
  })
