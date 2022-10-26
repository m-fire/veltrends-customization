import { MouseEventHandler, useEffect, useState } from 'react'
import TabLayout from '~/components/layout/TabLayout'
import { json, LoaderFunction } from '@remix-run/node'
import { getItemList } from '~/common/api/items'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { ItemListPagination } from '~/common/api/types'
import LinkCardList from '~/components/home/LinkCardList'
import { Requests } from '~/common/util/https'

export default function Index() {
  const data = useLoaderData<ItemListPagination>()
  const [pages, setPages] = useState([data])
  const fetcher = useFetcher<ItemListPagination>()

  const onClick: MouseEventHandler = (e) => {
    const { hasNextPage, lastCursor } = pages.at(-1)?.pageInfo ?? {
      lastCursor: null,
      hasNextPage: false,
    }
    if (!hasNextPage) return null

    fetcher.load(
      /* Remix 특징: '&index' 를 붙여야 함 */
      `/?cursor=${lastCursor}` + '&index',
    )
  }

  useEffect(() => {
    const page = fetcher.data
    if (!page || pages.includes(page)) return
    setPages(pages.concat(page))
  }, [fetcher.data, pages])

  const items = pages.flatMap((p) => p.list)
  return (
    <TabLayout>
      <LinkCardList items={items} />
      <button onClick={onClick}>ClickMe</button>
    </TabLayout>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const { cursor } = Requests.parseUrlParams<{ cursor?: string }>(request.url)
  const parsedCursor = cursor != null ? parseInt(cursor, 10) : undefined

  const itemList = await getItemList(parsedCursor)
  return json(itemList)
}

// Inner Components
