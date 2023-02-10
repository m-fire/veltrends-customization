import AbstractModeListing from '../../core/pagination/AbstractModeListing.js'
import AppError from '../../common/error/AppError.js'
import { Validator } from '../../common/util/validates.js'
import { Formatters } from '../../common/util/formatters.js'
import { ListingParams } from '../../core/pagination/types.js'
import ItemRepository from '../../repository/ItemRepository.js'

/**
 * 1주(7일 0시간 0분 0초 0000밀리초) 기간을 1/1000 초단위로 환산 <br />
 * 6(일) * 24(시간) * 60(분) * 60(초) * 1000(1/1000 초)
 */
const WEEK_MILLISECOND = 6 * 24 * 60 * 60 * 1000

type PastItem = Awaited<
  ReturnType<typeof ItemRepository.findItemListByCursorAndDateRange>
>[0]

class PastListing extends AbstractModeListing<PastItem> {
  private static instance: PastListing

  static getInstance() {
    if (PastListing.instance == null) {
      PastListing.instance = new PastListing()
    }
    return PastListing.instance
  }

  protected async getTotalCount({ startDate, endDate }: ListingParams) {
    //
    if (!startDate || !endDate) {
      throw new AppError('BadRequest', {
        message: 'startDate or endDate is missing',
      })
    }
    const isInvalidDateFormat = [startDate, endDate].some((date) =>
      Validator.DateFormat.yyyymmdd(date),
    )
    if (isInvalidDateFormat) {
      throw new AppError('BadRequest', {
        message: 'startDate or endDate is not yyyy-mm-dd format',
      })
    }

    const startMillis = new Date(startDate).getTime()
    const endMillis = new Date(endDate).getTime()
    const distanceMillisecond = endMillis - startMillis
    if (distanceMillisecond > WEEK_MILLISECOND) {
      throw new AppError('BadRequest', {
        message: 'Date range bigger than 7 days',
      })
    }

    const rangeCount = await ItemRepository.countCreatedDateRange({
      startDate: Formatters.Date.yyyymmdd_hhmmss(startDate),
      endDate: Formatters.Date.yyyymmdd_hhmmss(endDate, '23:59:59'),
    })
    return rangeCount
  }

  protected async findList(options: ListingParams) {
    return ItemRepository.findItemListByCursorAndDateRange(options, {
      orderBy: [{ itemStatus: { likeCount: 'desc' } }, { id: 'desc' }],
    })
  }

  protected async hasNextPage(
    options: ListingParams, // lastElement?: PastItem,
  ) {
    //
    const { cursor, startDate, endDate } = options
    const fullStartDate = startDate
      ? Formatters.Date.yyyymmdd_hhmmss(startDate)
      : undefined
    const fullEndDate = endDate
      ? Formatters.Date.yyyymmdd_hhmmss(endDate, '23:59:59')
      : undefined

    const totalPage = await ItemRepository.countCreatedDateRange(
      {
        cursor,
        startDate: fullStartDate,
        endDate: fullEndDate,
      },
      {
        orderBy: [{ itemStatus: { likeCount: 'desc' } }, { id: 'desc' }],
      },
    )
    return totalPage > 0
  }

  protected getLastCursorOrNull(lastElement: PastItem): number | null {
    return lastElement?.id ?? null
  }
}
export default PastListing
