import { ListingInfo } from '../pagination/types.js'
import { Pagination } from '../config/fastify/types.js'

export const Pages = {
  createPage<E>({
    list,
    totalCount,
    hasNextPage,
    lastCursor,
  }: ListingInfo<E>): Pagination<E> {
    return {
      list,
      totalCount: totalCount,
      pageInfo: {
        hasNextPage,
        lastCursor: lastCursor ?? null,
      },
    }
  },

  emptyPage() {
    return this.createPage({
      list: [],
      totalCount: 0,
      hasNextPage: false,
      lastCursor: null,
    })
  },
} as const
