import { FastifySchema } from 'fastify'
import { RequestGenericInterface } from 'fastify/types/request'
import { Static, TSchema } from '@sinclair/typebox'
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
}
