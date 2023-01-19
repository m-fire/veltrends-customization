import { ItemListMode } from '~/core/api/types'
import { useMemo } from 'react'
import { WeekRangeConverters } from '~/common/util/converters'
import { useSearchParams } from '@remix-run/react'

export function useListModeURLParams(defaultMode: ItemListMode) {
  const defaultDateRange = useMemo(
    () => WeekRangeConverters.toRangeString(new Date()),
    [],
  )
  const [searchParams] = useSearchParams()
  return {
    mode: (searchParams.get('mode') as ItemListMode) ?? defaultMode,
    dateRange: {
      start: searchParams.get('start') ?? defaultDateRange.start,
      end: searchParams.get('end') ?? defaultDateRange.end,
    },
  }
}
