import ItemRepository from '../../repository/ItemRepository.js'

export type ListMode = 'recent' | 'trending' | 'past'

export type ListingInfo<E> = {
  totalCount: number
  list: E[]
  hasNextPage: boolean
  lastCursor: number | null
}

export type ListingParams = ByCursorParams &
  Partial<Omit<ByCursorAndDateRangeParams, keyof ByCursorParams>>

type ByCursorParams = Parameters<typeof ItemRepository.findItemListByCursor>[0]
type ByCursorAndDateRangeParams = Parameters<
  typeof ItemRepository.findItemListByCursorAndDateRange
>[0]

export interface Listing<E> {
  listing(options: ListingParams): Promise<ListingInfo<E>>
}
