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

/* 라우트 API 의 응답(res) 타입지정(서비스 메서드 반환 등..)을 위해 구현하였으나,
  서비스 단의 가공된 반환타입과 SCHEMA 에 정의된 타입이 미묘하게 매치 되지않아
  쓰이지 않을 것으로 예상.                                                         */

/**
 * `response` 속성에 정의된 스키마를 [StatusCode: Type] 형태로 TypeMap 을 생성한다.
 */
export type RouteResponseCodeMap<T extends Record<string, FastifySchema>> = {
  [A in keyof T]: T[A]['response'] extends Record<number, TSchema>
    ? FastifyResponseCodeProps<T[A]['response']>
    : never
}

type FastifyResponseCodeProps<Res extends Record<string, TSchema>> = {
  [Code in keyof Res]: Res[Code] extends TSchema ? Static<Res[Code]> : never
}
