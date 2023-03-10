import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import { ListingParams } from '../../core/pagination/types.js'
import ItemRepository from '../../repository/ItemRepository.js'

type RecentItem = Awaited<
  ReturnType<typeof ItemRepository.findItemListByCursor>
>[0]

class RecentListing extends AbstractModeListing<RecentItem> {
  private static instance: RecentListing

  static getInstance() {
    if (RecentListing.instance == null) {
      RecentListing.instance = new RecentListing()
    }
    return RecentListing.instance
  }

  protected async getTotalCount(options: ListingParams) {
    return ItemRepository.countAllItems()
  }

  protected async findList(options: ListingParams) {
    return ItemRepository.findItemListByCursor(options, {
      orderBy: { id: 'desc' },
    })
  }

  protected async hasNextPage(
    { cursor }: ListingParams, // lastElement?: RecentItem,
  ) {
    const totalPage = await ItemRepository.countFromCursor(
      { cursor },
      {
        orderBy: { createdAt: 'desc' },
      },
    )
    return totalPage > 0
  }

  protected getLastCursorOrNull(lastElement?: RecentItem): number | null {
    return lastElement?.id ?? null
  }
}
export default RecentListing
