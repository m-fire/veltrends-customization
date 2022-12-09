import db from '../../../common/config/prisma/db-client.js'
import BaseItemsPaging, { PagingParamsOf } from './BaseItemsPaging.js'
import AppError from '../../../common/error/AppError.js'
import { Validator } from '../../../common/util/validates.js'
import { Converts } from '../../../common/util/converts.js'

const WEEK_MILLISECOND = 6 * 24 * 60 * 60 * 1000

type PastItem = Awaited<ReturnType<typeof findPastItemList>>[0]

class PastPaging extends BaseItemsPaging<'past', PastItem> {
  private static instance: PastPaging

  static getInstance() {
    if (PastPaging.instance == null) {
      PastPaging.instance = new PastPaging()
    }
    return PastPaging.instance
  }

  protected async totalCount({ startDate, endDate }: PagingParamsOf<'past'>) {
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

    const fullStartDate = startDate
      ? Converts.Date.newYyyymmddHhmmss(startDate)
      : undefined
    const fullEndDate = endDate
      ? Converts.Date.newYyyymmddHhmmss(endDate, '23:59:59')
      : undefined
    return db.item.count({
      where: {
        createdAt: {
          gte: fullStartDate,
          lte: fullEndDate,
        },
      },
    })
  }

  protected async pagingList(options: PagingParamsOf<'past'>) {
    return findPastItemList(options)
  }

  protected async hasNextPage(
    options: PagingParamsOf<'past'>, // lastItem?: PastItem,
  ) {
    console.log(`PastPaging.ts> PastPaging.hasNextPage()`, { options })
    const { ltCursor, startDate, endDate } = options
    const fullStartDate = startDate
      ? Converts.Date.newYyyymmddHhmmss(startDate)
      : undefined
    const fullEndDate = endDate
      ? Converts.Date.newYyyymmddHhmmss(endDate, '23:59:59')
      : undefined

    const totalPage = await db.item.count({
      where: {
        id: { lt: ltCursor || undefined },
        createdAt: {
          gte: fullStartDate,
          lte: fullEndDate,
        },
      },
      orderBy: [
        {
          itemStatus: { likeCount: 'desc' },
        },
        { id: 'desc' },
      ],
    })
    return totalPage > 0
  }

  protected getLastCursorOrNull(lastItem: PastItem): number | null {
    return lastItem?.id ?? null
  }
}
export default PastPaging

// db query func

export function findPastItemList({
  ltCursor,
  limit,
  startDate,
  endDate,
}: {
  ltCursor?: number | null
  limit: number
  startDate?: string
  endDate?: string
}) {
  const fullStartDate = startDate
    ? Converts.Date.newYyyymmddHhmmss(startDate)
    : undefined
  const fullEndDate = endDate
    ? Converts.Date.newYyyymmddHhmmss(endDate, '23:59:59')
    : undefined

  return db.item.findMany({
    orderBy: [{ itemStatus: { likeCount: 'desc' } }, { id: 'desc' }],
    where: {
      id: { lt: ltCursor || undefined },
      createdAt: {
        gte: fullStartDate,
        lte: fullEndDate,
      },
    },
    include: {
      user: { select: { id: true, username: true } },
      itemStatus: {
        select: {
          id: true,
          likeCount: true,
          commentCount: true,
        },
      },
      publisher: true,
    },
    take: limit,
  })
}
