import { FastifySchema } from 'fastify'
import { TSchema, Type } from '@sinclair/typebox'
import AppError from '../../error/AppError.js'
import { Nullable } from './type-util.js'

export function createFastifySchemaMap<T extends Record<string, FastifySchema>>(
  params: T,
) {
  return params
}

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
    totalCount: Type.Integer(),
    pageInfo: Type.Object(
      {
        hasNextPage: Type.Optional(Type.Boolean()),
        lastCursor: Type.Optional(Nullable(Type.Integer())),
        nextOffset: Type.Optional(Nullable(Type.Integer())),
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
