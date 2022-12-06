import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { useInfiniteQuery } from '@tanstack/react-query'
import { stringify } from 'qs'
import styled, { keyframes } from 'styled-components'
import TabLayout from '~/common/component/layout/TabLayout'
import Header from '~/common/component/base/Header'
import SearchInput from '~/core/component/search/SearchInput'
import { useDebounce } from 'use-debounce'
import { Requests } from '~/common/util/https'
import { useInfiniteScroll } from '~/common/hook/useInfiniteScroll'
import { searchItemList } from '~/core/api/search'
import SearchResultCardList from '~/core/component/search/SearchResultCardList'
import { SearchedItemPagination } from '~/core/api/types'
import { Loading, NotSearch } from '~/core/component/generate/svg'
import { flexStyles } from '~/common/style/styled'
import { colors } from '~/common/style/colors'
import { AnimatePresence } from 'framer-motion'

function Search() {
  const [searchParams] = useSearchParams()
  const initialText = searchParams.get('q') ?? '' // input text state 유지(텍스트 리셋 방지)
  const [searchText, setSearchText] = useState(initialText)
  // searchText 변경시 값 변동이 없는 상태에서 딜레이 이후 debouncedSearchText 값 변경
  const [debouncedSearchText] = useDebounce(searchText, 600)

  const data = useLoaderData<SearchedItemPagination>()
  const {
    hasNextPage,
    data: infiniteData,
    isFetching,
    fetchNextPage, // 다음 페이지 가져오기 요청함수
  } = useInfiniteQuery(
    ['searchResults', debouncedSearchText],
    ({ pageParam: offset }) =>
      searchItemList({ q: debouncedSearchText, offset }),
    {
      enabled: debouncedSearchText !== '',
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.pageInfo.hasNextPage) return null
        return lastPage.pageInfo.nextOffset
      },
      initialData: {
        pageParams: [undefined],
        pages: [data],
      },
    },
  )

  const fetchNext = useCallback(async () => {
    if (!hasNextPage) return
    await fetchNextPage()
  }, [hasNextPage, fetchNextPage])
  const intersectionRef = useRef<HTMLDivElement>(null)
  useInfiniteScroll(intersectionRef, fetchNext)

  const navigate = useNavigate()
  useEffect(() => {
    navigate('/search?' + stringify({ q: debouncedSearchText }))
  }, [debouncedSearchText, navigate])

  const itemList = infiniteData?.pages.flatMap((page) => page.list)
  const isSearched = itemList != null && itemList.length > 0

  return (
    <TabLayout
      header={
        <StyledHeader
          title={
            <SearchInput value={searchText} onChangeText={setSearchText} />
          }
        />
      }
    >
      <AnimatePresence initial={false}>
        {isFetching ? (
          <NotSearchedBlock>
            <StyledSpinner />
          </NotSearchedBlock>
        ) : isSearched ? (
          <SearchResultCardList list={itemList} />
        ) : (
          <NotSearchedBlock>
            <h3>검색된 항목이 없습니다</h3>
            <StyledNotSearch />
          </NotSearchedBlock>
        )}
      </AnimatePresence>

      <div ref={intersectionRef} />
    </TabLayout>
  )
}
export default Search

/* Remix routes handler */

export const loader: LoaderFunction = async ({ request }) => {
  const { q } = Requests.parseUrlParams<{ q?: string }>(request.url)

  if (!q) {
    return json({
      list: [],
      totalCount: 0,
      pageInfo: {
        nextOffset: null,
        hasNextPage: false,
      },
    })
  }
  // @todo: handler errors

  const searchResult = await searchItemList({ q })
  return json(searchResult)
}

// Inner Components

const StyledHeader = styled(Header)`
  & > .title {
    width: 100%;
  }
`

const NotSearchedBlock = styled.div`
  ${flexStyles({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  })}

  h3 {
    color: ${colors.grey2};
  }
`

const StyledNotSearch = styled(NotSearch)`
  width: 200px;
  height: 200px;
  color: ${colors.grey1};
`

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const StyledSpinner = styled(Loading)`
  width: 40px;
  height: 40px;
  color: ${colors.primary1};
  animation: ${spin} 1s infinite steps(8);
`
