import React, { useEffect, useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { useInfiniteQuery } from '@tanstack/react-query'
import { stringify } from 'qs'
import styled, { keyframes } from 'styled-components'
import TabLayout from '~/common/component/layout/TabLayout'
import HeaderMobile from '~/common/component/base/HeaderMobile'
import SearchInput, {
  SearchInputProps,
} from '~/core/component/search/SearchInput'
import { useDebounce } from 'use-debounce'
import { Requests } from '~/common/util/https'
import { useInfinityScrollTriggerRef } from '~/common/hook/useInfiniteScroll'
import { searchItemList } from '~/core/api/search'
import SearchResultCardList from '~/core/component/search/SearchResultCardList'
import { Pagination } from '~/common/api/types'
import { SearchedItem } from '~/core/api/types'
import { Loading, NotSearch } from '~/core/component/generate/svg'
import { colors } from '~/core/style/colors'
import { AnimatePresence } from 'framer-motion'
import { Flex } from '~/common/style/css-builder'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryText = searchParams.get('q') ?? ''
  // input text state 유지(텍스트 리셋 방지)
  const [textState, setTextState] = useState({
    searched: queryText,
    current: queryText,
  })
  // textState 변경시 값 변동이 없는 상태에서 딜레이 이후 debouncedText 값 변경
  const [debouncedText] = useDebounce(textState.current, 600)

  const data = useLoaderData<Pagination<SearchedItem>>()
  const {
    hasNextPage,
    data: infiniteData,
    isFetching,
    fetchNextPage, // 다음 페이지 가져오기 요청함수
  } = useInfiniteQuery(
    ['searchResults', debouncedText],
    async ({ pageParam: offset }) => {
      const trimedText = debouncedText.trim()
      setSearchParams({ ...searchParams, q: trimedText })
      setTextState({ current: trimedText, searched: trimedText })
      const items = await searchItemList({ q: trimedText, offset })
      return items
    },
    {
      enabled: debouncedText !== textState.searched && debouncedText !== '',
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

  const triggerRef = useInfinityScrollTriggerRef<HTMLDivElement>({
    hasNextPage,
    fetchNextPage,
  })

  const navigate = useNavigate()
  useEffect(() => {
    navigate('/search?' + stringify({ q: debouncedText }))
  }, [debouncedText, navigate])

  const itemList = infiniteData?.pages.flatMap((page) => page.list)
  const isSearched = itemList != null && itemList.length > 0

  const onChangeText: SearchInputProps['onChangeText'] = (text) => {
    setTextState({ ...textState, current: text })
  }
  return (
    <TabLayout
      header={
        <StyledHeader
          title={
            <SearchInput
              value={textState.current}
              onChangeText={onChangeText}
            />
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

      <div ref={triggerRef} />
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

const StyledHeader = styled(HeaderMobile)`
  & > .title {
    width: 100%;
  }
`

const NotSearchedBlock = styled.div`
  ${Flex.Item.flex1};
  ${Flex.Container.style()
    .direction('column')
    .alignItems('center')
    .justifyContent('center')
    .create()};

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
