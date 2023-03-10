import {
  FastifySchema,
  FastifyInstance,
  FastifyLoggerInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  FastifyPluginOptions,
} from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RequestGenericInterface } from 'fastify/types/request'
import { Static, TObject, TSchema } from '@sinclair/typebox'
import { PAGINATION_OPTION_SCHEMA } from '../typebox/schema.js'

export interface Pagination<E> {
  list: E[]
  totalCount: number
  pageInfo: PageInfo
}

export interface PageInfo {
  hasNextPage?: boolean
  lastCursor?: number | null
  nextOffset?: number | null
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

/**
 * `response` 속성에 정의된 스키마를 [StatusCode: Type] 형태로 TypeMap 을 생성한다.
 */
export type RouteResponseCodeMap<T extends Record<string, FastifySchema>> = {
  [A in keyof T]: T[A]['response'] extends Record<number, TSchema>
    ? FastifyResponseCodeProps<T[A]['response']>
    : never
}

type FastifyResponseCodeProps<Res extends Record<string, TSchema>> = {
  [RCode in keyof Res]: Res[RCode] extends TSchema ? Static<Res[RCode]> : never
}

// fastify type plugin: type provider

type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyLoggerInstance,
  TypeBoxTypeProvider
>

export type FastifyPluginAsyncTypebox<
  Options extends FastifyPluginOptions = Record<never, never>,
> = (fastify: FastifyTypebox, opts: Options) => Promise<void>
