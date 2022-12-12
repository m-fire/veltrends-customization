import { useCallback, useEffect, useRef, useState } from 'react'
import TabLayout from '~/common/component/layout/TabLayout'
import { json, LoaderFunction } from '@remix-run/node'
import { getItemList } from '~/core/api/items'
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { ItemListPagination, ListMode } from '~/core/api/types'
import LinkCardList from '~/core/component/home/LinkCardList'
import { Requests } from '~/common/util/https'
import { useInfiniteScroll } from '~/common/hook/useInfiniteScroll'
import ListModeSelector from '~/core/component/home/ListModeSelector'
import { useInfiniteQuery } from '@tanstack/react-query'

function Index() {
  // URL Parameter 에서 초기값 가져와서 state 바인딩
  const [searchParams] = useSearchParams()
  const modeParam = (searchParams.get('mode') as any) ?? 'trending'

  // API 서버로부터 데이터로딩 with 1-remix-fetch & 2-react-query
  const initialData = useLoaderData<ItemListPagination>()
  const [mode, setMode] = useState<ListMode>(modeParam)
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['items', mode],
    ({ pageParam }) => getItemList({ mode, cursor: pageParam }),
    {
      initialData: {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return null
        return lastPage.pageInfo.lastCursor // pageParam 로 사용
      },
    },
  )

  // 모드가 변경될 때마다, 모드별 요청 파라미터 변경 후 이동
  const navigate = useNavigate()
  useEffect(() => {
    const nextUrl = mode === 'trending' ? '/' : `/?mode=${mode}`
    navigate(nextUrl, { replace: true })
  }, [mode, navigate])

  // 감지영역에 screen 이 도달한 경우, react-query 를 통해 다음목록 붙이기
  const fetchNext = useCallback(async () => {
    if (!hasNextPage) return
    // Fixed: react-query 의 fetchNextPage() 를 그대로 무한스크롤로딩에 붙이면,
    // 기존 목록에 새로 불러온 데이터를 덧붙게 된다. 이를 막기위해
    // 한번 로딩이 되었다면, 기존 데이터 외에 받은 데이터만 붙이도록 수정.
    await fetchNextPage()
  }, [fetchNextPage, hasNextPage])
  const intersectionRef = useRef<HTMLDivElement>(null)
  useInfiniteScroll(intersectionRef, fetchNext)

  const items = data?.pages.flatMap((page) => page.list)
  return (
    <TabLayout>
      <ListModeSelector mode={mode} onSelectMode={setMode} />
      {items ? <LinkCardList items={items} /> : null}
      <div ref={intersectionRef} />
    </TabLayout>
  )
}
export default Index

// Remix handler

export const loader: LoaderFunction = async ({ request }) => {
  const { mode } = Requests.parseUrlParams<{ mode?: string }>(request.url)

  const fallbackedMode = mode ?? 'trending'

  console.log(fallbackedMode)
  // @todo: throw error if invalid error

  const itemList = await getItemList({
    mode: fallbackedMode as any,
    cursor: parsedCursor,

    // todo: 임시 Past 문자, 실제기능 구현
    startDate: '2022-12-12',
    endDate: '2022-12-06',
  })
  return json(itemList) // to useLoaderData() hook
}

// Inner Components
