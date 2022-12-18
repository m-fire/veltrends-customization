import { ListingInfo } from '../pagination/types.js'
import { Pagination } from '../../common/config/fastify/types.js'

export function createPage<T>({
  list,
  totalCount,
  hasNextPage,
  lastCursor,
}: ListingInfo<T>): Pagination<T> {
  return {
    list,
    totalCount: totalCount,
    pageInfo: {
      hasNextPage,
      lastCursor: lastCursor ?? null,
    },
  }
}

export function createEmptyPage() {
  return createPage({
    list: [],
    totalCount: 0,
    hasNextPage: false,
    lastCursor: null,
  })
}
