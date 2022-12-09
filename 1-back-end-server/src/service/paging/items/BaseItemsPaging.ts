import { ItemsPagingMode } from '../../ItemService.js'
import { findRecentItemList } from './RecentPaging.js'
import { findTredingItemList } from './TrendingPaging.js'
import { findPastItemList } from './PastPaging.js'

abstract class BaseItemsPaging<Mode extends ItemsPagingMode, E>
  implements ItemListPaging<Mode, E>
{
  async paging(
    options: PagingParamsOf<Mode>,
  ): Promise<ItemsPageInfoMap<E> | null> {
    //
    const [totalCount, itemList] = await Promise.all([
      this.totalCount(options),
      this.pagingList(options),
    ])
    if (totalCount === 0) return null
    if (itemList.length === 0) return null

    const lastItem = itemList?.at(-1)
    const hasNextPage = await this.hasNextPage(options, lastItem)
    const lastCursor = this.getLastCursorOrNull(lastItem)

    return { totalCount, itemList, hasNextPage, lastCursor }
  }

  protected abstract totalCount(options: PagingParamsOf<Mode>): Promise<number>

  protected abstract pagingList(options: PagingParamsOf<Mode>): Promise<E[]>

  protected abstract hasNextPage(
    options: PagingParamsOf<Mode>,
    lastItem?: E,
  ): Promise<boolean>

  protected abstract getLastCursorOrNull(lastItem?: E): number | null
}
export default BaseItemsPaging

export interface ItemListPaging<Mode extends ItemsPagingMode, E> {
  paging(options: PagingParamsOf<Mode>): Promise<ItemsPageInfoMap<E> | null>
}

export type ItemsPageInfoMap<E> = {
  totalCount: number
  itemList: E[]
  hasNextPage: boolean
  lastCursor: number | null
}

export type PagingParamsOf<Mode extends ItemsPagingMode> = Mode extends 'recent'
  ? Parameters<typeof findRecentItemList>[0]
  : Mode extends 'trending'
  ? Parameters<typeof findTredingItemList>[0]
  : Mode extends 'past'
  ? Parameters<typeof findPastItemList>[0]
  : undefined
