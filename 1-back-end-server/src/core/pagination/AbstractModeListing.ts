import { Listing, ListingInfo, ListingParams } from './types.js'

abstract class AbstractModeListing<E> implements Listing<E> {
  async listing(options: ListingParams): Promise<ListingInfo<E>> {
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

  protected abstract getTotalCount(options: ListingParams): Promise<number>

  protected abstract findList(options: ListingParams): Promise<E[]>

  protected abstract hasNextPage(
    options: ListingParams,
    lastElement?: E,
  ): Promise<boolean>

  protected abstract getLastCursorOrNull(lastElement?: E): number | null
}
export default AbstractModeListing
