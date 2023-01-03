import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Requests } from '~/common/util/https'
import { getItemList } from '~/core/api/items'
import { ItemListPage, ItemListMode } from '~/core/api/types'
import { useInfinityScrollTriggerRef } from '~/common/hook/useInfiniteScroll'
import TabLayout from '~/common/component/layout/TabLayout'
import LinkCardList from '~/core/component/home/LinkCardList'
import ListModeSelector from '~/core/component/home/ListModeSelector'
import DateRangeSelector from '~/core/component/home/DateRangeSelector'
import {
  DateStringRange,
  WeekRangeConverters as wrc,
} from '~/common/util/converters'

function Index() {
  const defaultDateRange = useCurrentDateRange()
  const {
    mode,
    dateRange: { start, end },
  } = getCurrentURLParams('trending', defaultDateRange)
  const [dateRange, setDateRange] = useState<DateStringRange>({ start, end })
  const { data, hasNextPage, fetchNextPage } = useItemsInfiniteQuery(
    ['items', mode, mode === 'past' ? { start } : undefined].filter(
      (key) => key != null,
    ),
    { mode, dateRange },
  )

  useEffect(() => {
    if (mode === 'past') {
      setDateRange({ start, end })
    }
  }, [mode, start, end])

  const triggerRef = useInfinityScrollTriggerRef<HTMLDivElement>({
    hasNextPage,
    fetchNextPage,
  })

  const itemList = data?.pages.flatMap((page) => page.list)
  return (
    <TabLayout>
      <ListModeSelector currentMode={mode} dateRange={dateRange} />

      {mode === 'past' ? (
        <DateRangeSelector
          baseLinkTo={`/?mode=${mode}`}
          dateRange={dateRange}
        />
      ) : null}

      {itemList ? <LinkCardList items={itemList} /> : null}

      {/* Infinity Scroll Intersection Area */}
      <div ref={triggerRef} />
    </TabLayout>
  )

  /* refactoring */
  function useItemsInfiniteQuery(
    queryKey: Parameters<typeof useInfiniteQuery>[0],
    { mode, dateRange }: UseItemsInfiniteQueryParams,
  ) {
    const initialData = useLoaderData<ItemListPage>()
    const queryResult = useInfiniteQuery(
      queryKey,
      async ({ pageParam: cursor }) => {
        const { start, end } = dateRange
        const itemsPage = await getItemList({
          mode,
          cursor,
          ...(mode === 'past' ? { startDate: start, endDate: end } : undefined),
        })
        return itemsPage
      },
      {
        initialData: {
          pageParams: [undefined],
          pages: [initialData], // from Remix loader
        },
        getNextPageParam: (lastPage) => {
          if (!lastPage.pageInfo.hasNextPage) return null
          return lastPage.pageInfo.lastCursor
        },
      },
    )
    return queryResult
  }
  type UseItemsInfiniteQueryParams = {
    mode: ItemListMode
    dateRange: DateStringRange
  }

  function useCurrentDateRange() {
    return useMemo(() => wrc.toRangeString(new Date()), [])
  }

  function getCurrentURLParams(
    defaultMode: ItemListMode,
    defaultDateRange: DateStringRange,
  ) {
    const [searchParams] = useSearchParams()
    return {
      mode: (searchParams.get('mode') as ItemListMode) ?? defaultMode,
      dateRange: {
        start: searchParams.get('start') ?? defaultDateRange.start,
        end: searchParams.get('end') ?? defaultDateRange.end,
      },
    }
  }
}
export default Index

// Remix handler

export const loader: LoaderFunction = async ({ request }) => {
  const { mode, start, end } = Requests.parseUrlParams<HomeRequestURLParams>(
    request.url,
  )

  const fallbackMode = mode ?? 'trending'
  const defaultRange = wrc.toRangeString(new Date())
  const dateRange = mode === 'past' ? defaultRange : undefined

  const itemListPage = await getItemList({
    mode: fallbackMode as any,
    startDate: start ?? dateRange?.start,
    endDate: end ?? dateRange?.end,
  })

  return json(itemListPage) // to useLoaderData() hook
}

// Inner Components

// types

type HomeRequestURLParams = {
  mode: string | null
  start: string | null
  end: string | null
}
