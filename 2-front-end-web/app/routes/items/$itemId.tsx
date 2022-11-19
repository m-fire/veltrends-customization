import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { getItem } from '~/common/api/items'
import { Item } from '~/common/api/types'
import BasicLayout from '~/components/layout/BasicLayout'
import ItemViewer from '~/components/items/ItemViewer'

type ItemProps = {}

function Item({}: ItemProps) {
  const { item } = useLoaderData<ItemLoaderData>()

  //Todo: Header tool menu 구성
  return (
    <BasicLayout hasBackButton title={null}>
      <ItemViewer item={item} />
    </BasicLayout>
  )
}
export default Item

// Remix handler

export const loader: LoaderFunction = async ({ request, params }) => {
  // todo: validate itemId
  const itemId = parseInt(params.itemId!, 10)
  const item = await getItem(itemId)
  return json({
    item,
  })
}

interface ItemLoaderData {
  item: Item
}

// todo: handle 404

// Inner Components
