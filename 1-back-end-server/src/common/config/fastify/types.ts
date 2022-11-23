import { FastifySchema } from 'fastify'
import { RequestGenericInterface } from 'fastify/types/request'
import { Static, TObject, TSchema } from '@sinclair/typebox'
import { PAGINATION_OPTION_SCHEMA } from '../typebox/common-schema.js'

export interface Pagination<T> {
  list: T[]
  totalCount: number
  pageInfo: {
    hasNextPage: boolean
    lastCursor: number
  }
}

export type PaginationOptions = Static<typeof PAGINATION_OPTION_SCHEMA>

export type RouteRequestMap<T extends Record<string, FastifySchema>> = {
  [K in keyof T]: FastifyRequestProps<T[K]>
}

interface FastifyRequestProps<SCHEMA extends FastifySchema>
  extends RequestGenericInterface {
  Params: SCHEMA['params'] extends TSchema ? Static<SCHEMA['params']> : never
  Querystring: SCHEMA['querystring'] extends TSchema
    ? Static<SCHEMA['querystring']>
    : never
  Body: SCHEMA['body'] extends TSchema ? Static<SCHEMA['body']> : never
  // Header: SCHEMA['headers'] extends TSchema ? Static<SCHEMA['headers']> : never
}

/* 라우트 API 의 응답(res) 타입지정을 위해 구현하였으나, 불필요해서 주석처리함
   향후 쓸모있을 수 있다. */
// export type RouteResponseCodeMap<T extends Record<string, FastifySchema>> = {
//   [A in keyof T]: T[A]['response'] extends Record<number, TSchema>
//     ? FastifyResponseCodeProps<T[A]['response']>
//     : never
// }
//
// type FastifyResponseCodeProps<Res extends Record<string, TSchema>> = {
//   [Code in keyof Res]: Res[Code] extends TSchema
//     ? Record<Code, Static<Res[Code]>>
//     : never
// }
