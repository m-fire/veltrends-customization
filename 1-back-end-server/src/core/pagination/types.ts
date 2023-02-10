import ItemRepository, {
  ItemFindManyQuery,
} from '../../repository/ItemRepository.js'
import { Prisma } from '@prisma/client'

export type ListingInfo<E> = {
  totalCount: number
  list: E[]
  hasNextPage: boolean
  lastCursor: number | null
}

export type ListMode = 'recent' | 'trending' | 'past'

export interface Listing<E> {
  listing(
    options: ListingParams,
    query: ItemFindManyQuery,
  ): Promise<ListingInfo<E>>
}

export type ListingParams = FindItemsByCursorParams &
  Partial<Omit<ByCursorAndDateRangeParams, keyof FindItemsByCursorParams>> & {
    limit: number
  }

type FindItemsByCursorParams = Parameters<
  typeof ItemRepository.findItemListByCursor
>[0]

type ByCursorAndDateRangeParams = Parameters<
  typeof ItemRepository.findItemListByCursorAndDateRange
>[0]
