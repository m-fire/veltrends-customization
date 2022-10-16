import { Static } from '@sinclair/typebox'
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
