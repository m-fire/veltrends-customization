import { useCallback, useEffect, useRef, useState } from 'react'
import TabLayout from '~/common/component/layout/TabLayout'
import { json, LoaderFunction } from '@remix-run/node'
import { getItemList } from '~/core/api/items'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { ItemListPagination, ListMode } from '~/core/api/types'
import LinkCardList from '~/core/component/home/LinkCardList'
import { Requests } from '~/common/util/https'
import { useInfiniteScroll } from '~/common/hook/useInfiniteScroll'

function Index() {
  const data = useLoaderData<ItemListPagination>()
  useEffect(() => {
    console.log(`index.tsx> API 서버에서 받아온 페이지데이터`, { data })
  }, [data])

  const [pages, setPages] = useState([data])
  const fetcher = useFetcher<ItemListPagination>()
  useEffect(() => {
    const page = fetcher.data
    // 새 페이지가 있으면, 기존목록에 새 페이지 추가
    if (!page || pages.includes(page)) return
    setPages(pages.concat(page))
  }, [fetcher.data, pages])

  const [mode, setMode] = useState<ListMode>('trending')
  const navigate = useNavigate()
  useEffect(() => {
    const nextUrl = mode === 'trending' ? '/' : `/?mode=${mode}`
    navigate(nextUrl, { replace: true })
  }, [mode, navigate])

  // 다음 목록페이지 요청
  const fetchNext = useCallback(() => {
    const { hasNextPage, lastCursor } = pages.at(-1)?.pageInfo ?? {
      lastCursor: null,
      hasNextPage: false,
    }
    if (fetcher.state === 'loading') return
    if (!hasNextPage) return
    fetcher.load(
      /* Remix 특징: '&index' 를 붙여야 함 */
      `/?cursor=${lastCursor}` + '&index',
    )
  }, [fetcher, pages])

  // 감지영역에 screen 이 도달한 경우, 목록 끝에 다음페이지 붙이기
  const intersectionRef = useRef<HTMLDivElement>(null)
  useInfiniteScroll(intersectionRef, fetchNext)

  const items = pages.flatMap((p) => p.list)
  return (
    <TabLayout>
      <LinkCardList items={items} />
      <div ref={intersectionRef} />
    </TabLayout>
  )
}
export default Index

// Remix handler

export const loader: LoaderFunction = async ({ request }) => {
  const { cursor, mode, startDate, endDate } = Requests.parseUrlParams<{
    mode?: string
    cursor?: string
    startDate?: string
    endDate?: string
  }>(request.url)

  const fallbackedMode = mode ?? 'trending'
  const parsedCursor = cursor != null ? parseInt(cursor, 10) : undefined

  console.log(fallbackedMode)
  // @todo: throw error if invalid error

  const itemList = await getItemList({
    mode: fallbackedMode as any,
    cursor: parsedCursor,

    // todo: 임시 Past 문자, 실제기능 구현
    startDate: '2022-12-12',
    endDate: '2022-12-06',
  })
  return json(itemList)
}

// Inner Components
