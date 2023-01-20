import { useLoaderData, useNavigate } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { deleteItem, getItem } from '~/core/api/items'
import { getCommentList } from '~/core/api/items$comments'
import { Item, Comment } from '~/core/api/types'
import BasicLayout from '~/core/component/home/BasicLayout'
import ItemViewer from '~/core/component/items/ItemViewer'
import CommentList from '~/core/component/items/CommentList'
import { useCommentListQuery } from '~/core/hook/query/useCommentsQuery'
import CommentInputOverlay from '~/core/component/items/CommentInputOverlay'
import MoreVertButton from '~/core/component/items/MoreVertButton'
import { useUserState } from '~/common/store/user'
import useBottomSheetModalStore from '~/common/hook/store/useBottomSheetModalStore'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { Media } from '~/common/style/media-query'
import styled from 'styled-components'

type ItemByIdProps = {}

function ItemById({}: ItemByIdProps) {
  const loaderData = useLoaderData<ItemLoaderData>()
  const { user } = useUserState()
  const { item } = loaderData
  const isLoggedIn = user?.id === item.user.id

  /* react-query 적용 동기: velopert */
  // comments 에서 처리할 action 종류가 4가지가 되는데 (like, commenting, commentLike, subcommentLike)
  // 4가지 액션이 발생할 때마다 type 분기문을 작성해야 하고, 액션 발생시 데이터캐싱 업데이트를 해야한다.
  // 따라서 react-query 의 캐싱기능과 함께 분기로직을 줄이고자 도입하게 되었다.
  // 물론 Remix loader 를 재실행하는 것도 한 방법이지만, 불필요한 호출을 줄이기 위한 방법으로
  // react-query 를 통해 로직간소화를 하게 되었다.
  const { data: commentList } = useCommentListQuery(item.id, {
    initialData: loaderData.commentList,
  })
  const { open: openBottomModal } = useBottomSheetModalStore(
    (store) => store.action,
  )
  const openDialog = useOpenDialog()
  const navigate = useNavigate()

  const onMoreVert = () => {
    openBottomModal([
      {
        name: '수정',
        onClick: () => {
          navigate(`/write/edit?itemId=${loaderData.item.id}`)
        },
      },
      {
        name: '삭제',
        onClick: () =>
          openDialog('DELETE_ITEM', {
            buttonTexts: {
              confirmText: '삭제',
              cancelText: '취소',
            },
            onConfirm: async () => {
              // todo: show fullscreen spinner on loading
              await deleteItem(item.id)
              navigate('/')
            },
          }),
      },
    ])
  }

  //Todo: Header tool menu 구성
  return (
    <>
      <BasicLayout
        title={null}
        headerRight={
          isLoggedIn ? (
            <MoreVertButton position="header" onClick={onMoreVert} />
          ) : null
        }
        hasBackButton
      >
        <Content>
          <ItemViewer item={item} />
          <CommentList commentList={commentList!} />
        </Content>
      </BasicLayout>
      <CommentInputOverlay />
    </>
  )
}
export default ItemById

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

const Content = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0 auto;
  margin-top: 32px;
  ${Media.minWidth.desktop} {
    margin-top: 0;
  }
`
