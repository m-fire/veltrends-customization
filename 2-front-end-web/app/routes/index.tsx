import { useCallback, useEffect, useRef, useState } from 'react'
import TabLayout from '~/components/layout/TabLayout'
import { json, LoaderFunction } from '@remix-run/node'
import { getItemList } from '~/common/api/items'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { ItemListPagination } from '~/common/api/types'
import LinkCardList from '~/components/home/LinkCardList'
import { Requests } from '~/common/util/https'
import { useInfiniteScroll } from '~/common/hooks/useInfiniteScroll'

function Index() {
  const data = useLoaderData<ItemListPagination>()
  const [pages, setPages] = useState([data])
  const fetcher = useFetcher<ItemListPagination>()

  // 새 페이지가 있으면, 기존목록에 새 페이지 추가
  useEffect(() => {
    const page = fetcher.data
    if (!page || pages.includes(page)) return
    setPages(pages.concat(page))
  }, [fetcher.data, pages])

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
    </TabLayout>
  )
}
export default Index

// Remix handler

export const loader: LoaderFunction = async ({ request }) => {
  const { cursor } = Requests.parseUrlParams<{ cursor?: string }>(request.url)
  const parsedCursor = cursor != null ? parseInt(cursor, 10) : undefined

  const itemList = await getItemList(parsedCursor)
  return json(itemList)
}

// Inner Components
