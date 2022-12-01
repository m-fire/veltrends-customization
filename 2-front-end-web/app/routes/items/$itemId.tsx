import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { getItem } from '~/core/api/items'
import { getCommentList } from '~/core/api/items$comments'
import { Item, Comment } from '~/core/api/types'
import BasicLayout from '~/common/component/layout/BasicLayout'
import ItemViewer from '~/core/component/items/ItemViewer'
import CommentList from '~/core/component/items/CommentList'
import { useCommentListQuery } from '~/core/hook/query/useCommentsQuery'
import CommentInputOverlay from '~/core/component/items/CommentInputOverlay'
import MoreVertButton from '~/common/component/system/MoreVertButton'
import { useAuthUser } from '~/common/context/UserContext'
import useBottomSheetModalStore from '~/common/hook/store/useBottomSheetModalStore'

type ItemProps = {}

function Item({}: ItemProps) {
  const loaderData = useLoaderData<ItemLoaderData>()
  const authUser = useAuthUser()
  const isMyItem = authUser?.id === loaderData.item.user.id

  /* react-query 적용 동기: velopert */
  // comments 에서 처리할 action 종류가 4가지가 되는데 (like, commenting, commentLike, subcommentLike)
  // 4가지 액션이 발생할 때마다 type 분기문을 작성해야 하고, 액션 발생시 데이터캐싱 업데이트를 해야한다.
  // 따라서 react-query 의 캐싱기능과 함께 분기로직을 줄이고자 도입하게 되었다.
  // 물론 Remix loader 를 재실행하는 것도 한 방법이지만, 불필요한 호출을 줄이기 위한 방법으로
  // react-query 를 통해 로직간소화를 하게 되었다.
  const { data: commentList } = useCommentListQuery(loaderData.item.id, {
    initialData: loaderData.commentList,
  })

  const onMoreVert = () => {
    alert(`$itemId.tsx> Item.onMoreVert()`)
  }

  //Todo: Header tool menu 구성
  return (
    <BasicLayout
      title={null}
      headerRight={
        isMyItem ? (
          <MoreVertButton position="header" onClick={onMoreVert} />
        ) : null
      }
      hasBackButton
    >
      <ItemViewer item={loaderData.item} />
      <CommentList commentList={commentList!} />
      <CommentInputOverlay />
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
