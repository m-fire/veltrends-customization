import { format } from 'date-fns'

export const YYYY_MM_DD = 'yyyy-MM-dd' as const
export const ONE_WEEK = 1 as const

export class WeekRangeConverters {
  /**
   * return formatted strings. default format: yyyy-MM-dd
   * @return DateString Tuple: [startDateString and endDateString]
   */
  static toRangeString(d: Date, dateFormat = YYYY_MM_DD): DateStringRange {
    const startDate = d.getDate() - d.getDay()
    return {
      start: format(new Date(d.setDate(startDate)), dateFormat),
      end: format(new Date(d.setDate(startDate + 6)), dateFormat),
    }
  }

  static toRangeDate(range: DateStringRange): DateRange {
    return {
      start: new Date(range.start),
      end: new Date(range.end),
    }
  }

  static plusWeeks(
    range: DateStringRange,
    plusWeeks = ONE_WEEK,
    dateFormat = YYYY_MM_DD,
  ): DateStringRange {
    if (plusWeeks <= 0) throw new Error('`plusWeeks` must be a positive int.')
    return wrc.changeRangeString(
      range,
      (start) => start.getDate() + plusWeeks * 7,
      dateFormat,
    )
  }

  static minusWeeks(
    range: DateStringRange,
    minusWeeks = ONE_WEEK,
    dateFormat = YYYY_MM_DD,
  ): DateStringRange {
    if (minusWeeks <= 0) throw new Error('`minusWeeks` must be a positive int.')
    return wrc.changeRangeString(
      range,
      (start) => start.getDate() - minusWeeks * 7,
      dateFormat,
    )
  }

  static changeRangeString(
    range: DateStringRange,
    chnage: (start: Date) => number,
    dateFormat = YYYY_MM_DD,
  ): DateStringRange {
    const prevStartDate = new Date(range.start)

    const nextStart = new Date(prevStartDate.setDate(chnage(prevStartDate)))
    const nextEnd = new Date(
      new Date(nextStart).setDate(nextStart.getDate() + 6),
    )
    return {
      start: format(nextStart, dateFormat),
      end: format(nextEnd, dateFormat),
    }
  }
}
const wrc = WeekRangeConverters

export type DateStringRange = { start: string; end: string }

export type ApiDateStringRange = { startDate: string; endDate: string }

export type DateRange = { start: Date; end: Date }
