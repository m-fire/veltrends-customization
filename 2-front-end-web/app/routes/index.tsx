import TabLayout from '~/components/layout/TabLayout'
import { json, LoaderFunction } from '@remix-run/node'
import { getItemList } from '~/common/api/items'
import { useLoaderData } from '@remix-run/react'
import { ItemListPagination } from '~/common/api/types'

export default function Index() {
  const data = useLoaderData<ItemListPagination>()
  console.log(`routes.Index() data:`, data)

  return <TabLayout>Index route</TabLayout>
}

export const loader: LoaderFunction = async ({ request }) => {
  const itemList = await getItemList()
  return json(itemList)
}

// Inner Components
