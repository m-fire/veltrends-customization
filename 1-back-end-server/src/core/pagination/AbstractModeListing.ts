import { Listing, ListingInfo, ListingParamsOf, ListMode } from './types.js'

abstract class AbstractModeListing<Mode extends ListMode, E>
  implements Listing<Mode, E>
{
  async listing(options: ListingParamsOf<Mode>): Promise<ListingInfo<E>> {
    //
    const [totalCount, list] = await Promise.all([
      this.getTotalCount(options),
      this.findList(options),
    ])

    if (totalCount === 0) {
      return { totalCount: 0, list, hasNextPage: false, lastCursor: null }
    }
    const lastElement = list?.at(-1)
    const hasNextPage = await this.hasNextPage(options, lastElement)
    const lastCursor = this.getLastCursorOrNull(lastElement)

    return { totalCount, list, hasNextPage, lastCursor }
  }

  protected abstract getTotalCount(
    options: ListingParamsOf<Mode>,
  ): Promise<number>

  protected abstract findList(options: ListingParamsOf<Mode>): Promise<E[]>

  protected abstract hasNextPage(
    options: ListingParamsOf<Mode>,
    lastElement?: E,
  ): Promise<boolean>

  protected abstract getLastCursorOrNull(lastElement?: E): number | null
}
export default AbstractModeListing
