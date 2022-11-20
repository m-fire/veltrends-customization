import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { getCommentList, getItem } from '~/common/api/items'
import { Item, Comment } from '~/common/api/types'
import BasicLayout from '~/components/layout/BasicLayout'
import ItemViewer from '~/components/items/ItemViewer'

type ItemProps = {}

function Item({}: ItemProps) {
  const { item, commentList } = useLoaderData<ItemLoaderData>()

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

  const [item, commentList] = await Promise.all([
    getItem(itemId),
    getCommentList(itemId),
  ])

  return json({ item, commentList })
}

interface ItemLoaderData {
  item: Item
  commentList: Comment[]
}

// todo: handle 404

// Inner Components
