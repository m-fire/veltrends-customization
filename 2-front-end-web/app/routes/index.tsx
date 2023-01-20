import React, { useEffect, useState } from 'react'
import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Requests } from '~/common/util/https'
import { getItemList } from '~/core/api/items'
import { Pagination } from '~/common/api/types'
import { Item, ItemListMode } from '~/core/api/types'
import { useInfinityScrollTriggerRef } from '~/common/hook/useInfiniteScroll'
import TabLayout from '~/core/component/home/TabLayout'
import LinkCardList from '~/core/component/items/LinkCardList'
import DateRangeSelector from '~/core/component/items/DateRangeSelector'
import {
  DateStringRange,
  WeekRangeConverters as wrc,
} from '~/common/util/converters'
import styled from 'styled-components'
import { Media } from '~/common/style/media-query'
import { useListModeURLParams } from '~/core/hook/request/useListModeURLParams'

function Index() {
  //
  const {
    mode,
    dateRange: { start, end },
  } = useListModeURLParams('trending')

  const loaderData = useLoaderData<Pagination<Item>>()
  const [dateRange, setDateRange] = useState<DateStringRange>({ start, end })
  const submodeOrNull = mode === 'past' ? { start } : null

  const { data, hasNextPage, fetchNextPage } = useItemsInfiniteQuery(
    loaderData,
    ['items', mode, submodeOrNull].filter((key) => key != null),
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
      <StyledDateRangeSelector
        baseLinkTo={`/?mode=${mode}`}
        dateRange={dateRange}
        visible={mode === 'past'}
      />

      {itemList ? <LinkCardList items={itemList} /> : null}

      {/* Infinity Scroll Intersection Area */}
      <div ref={triggerRef} />
    </TabLayout>
  )

  /* refactoring */
  function useItemsInfiniteQuery(
    initialData: any,
    queryKey: Parameters<typeof useInfiniteQuery>[0],
    { mode, dateRange }: UseItemsInfiniteQueryParams,
  ) {
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

const StyledDateRangeSelector = styled(DateRangeSelector)`
  padding-top: 12px;
  padding-bottom: 32px;

  ${Media.minWidth.tablet} {
    padding-top: 16px;
    gap: 48px;
  }
`

// types

type HomeRequestURLParams = {
  mode: string | null
  start: string | null
  end: string | null
}
