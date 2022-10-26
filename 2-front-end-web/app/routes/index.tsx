import TabLayout from '~/components/layout/TabLayout'
import { json, LoaderFunction } from '@remix-run/node'
import { getItemList } from '~/common/api/items'
import { useLoaderData } from '@remix-run/react'
import { ItemListPagination } from '~/common/api/types'
import LinkCardList from '~/components/home/LinkCardList'
import { Requests } from '~/common/util/https'

export default function Index() {
  const data = useLoaderData<ItemListPagination>()
  console.log(`routes.Index() data:`, data)

  return (
    <TabLayout>
      <LinkCardList items={data.list} />
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
