import { findRecentList } from '../../service/listing/RecentListing'
import { findTredingList } from '../../service/listing/TrendingListing'
import { findPastList } from '../../service/listing/PastListing'

export type ListMode = 'recent' | 'trending' | 'past'

export type ListingInfo<E> = {
  totalCount: number
  list: E[]
  hasNextPage: boolean
  lastCursor: number | null
}

export type ListingParamsOf<Mode extends ListMode> = Mode extends 'recent'
  ? Parameters<typeof findRecentList>[0]
  : Mode extends 'trending'
  ? Parameters<typeof findTredingList>[0]
  : Mode extends 'past'
  ? Parameters<typeof findPastList>[0]
  : undefined

export interface Listing<Mode extends ListMode, E> {
  listing(options: ListingParamsOf<Mode>): Promise<ListingInfo<E>>
}
