import styled from 'styled-components'
import { Comment } from '~/core/api/types'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import LikeButton from '~/core/component/routes/items/LikeButton'
import React from 'react'
import ReplyButton from '~/core/component/routes/items/ReplyButton'
import SubcommentList from '~/core/component/routes/items/SubcommentList'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useAuthUser } from '~/common/context/UserContext'
import { useItemIdParams } from '~/core/hook/useItemIdParams'
import AppError from '~/common/error/AppError'
import { MoreVert } from '~/core/component/generate/svg'
import useBottomSheetModalStore from '~/common/hook/store/useBottomSheetModalStore'
import { useDeleteComment } from '~/core/hook/useDeleteComment'
import {
  useCommentInputAction,
  useCommentAction,
} from '~/core/hook/useCommentAction'
import { useCommentActionStateById } from '~/core/hook/store/useCommentActionStore'
import { Flex, Font } from '~/common/style/css-builder'

export interface CommentElementProps {
  type: CommentType
  comment: Comment
}

function CommentElement({ comment, type }: CommentElementProps) {
  const {
    id: commentId,
    user,
    text,
    createdAt,
    subcommentList = [],
    mentionUser,
    isDeleted,
  } = comment

  const { likeComment, unlikeComment } = useCommentAction()
  const commentActionState = useCommentActionStateById(commentId)
  const likeCount = commentActionState?.likeCount ?? comment.likeCount
  const openDialog = useOpenDialog()
  const authUser = useAuthUser()
  const isLiked = commentActionState?.isLiked ?? comment.isLiked
  const itemId = useItemIdParams()

  const toggleLike = async () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (authUser == null) {
      openDialog('LIKE_COMMENT', { gotoLogin: true })
      return
    }
    if (isLiked) {
      await unlikeComment({ itemId, commentId, likeCount, isLiked })
    } else {
      await likeComment({ itemId, commentId, likeCount, isLiked })
    }
  }

  //댓글달기: 인증사용자인 경우 댓글달기 UI 제공, 없다면 로그인유도

  const inputStateActions = useCommentInputAction()

  const onReply = () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (authUser == null) {
      openDialog('WRITE_COMMENT')
      return
    }
    inputStateActions.writeComment(commentId)
  }

  const deleteComment = useDeleteComment()
  const openBottomModal = useBottomSheetModalStore((store) => store.action.open)
  const onClickMore = () => {
    openBottomModal([
      {
        name: '수정',
        onClick: () => inputStateActions.editComment(commentId, text),
      },
      {
        name: '삭제',
        onClick: () =>
          openDialog('DELETE_ITEM', {
            buttonTexts: {
              confirmText: '삭제',
              cancelText: '취소',
            },
            onConfirm: async () => await deleteComment(commentId),
          }),
      },
    ])
  }

  const pastDistance = useDateDistance(createdAt)
  const hasSubcomments = subcommentList.length > 0
  const isMyComment = comment.user.id === authUser?.id
  const isRootComment = type === 'root'

  return (
    <Block data-comment-id={commentId}>
      {isDeleted ? (
        <>
          <DeletedComment>· 삭제된 댓글입니다 ·</DeletedComment>
          {getSubcommentsOrNull({ isRootComment, hasSubcomments })}
        </>
      ) : (
        <>
          <CommentHead>
            <LeftGroup>
              <Username>{user.username}</Username> · <Time>{pastDistance}</Time>
            </LeftGroup>
            {isMyComment ? (
              <MoreButton onClick={onClickMore}>
                <MoreVert />
              </MoreButton>
            ) : null}
          </CommentHead>

          <CommentText>
            {mentionUser != null ? (
              <Mention>@{mentionUser.username}</Mention>
            ) : null}
            {text}
          </CommentText>

          <CommentFooter>
            <LikeBlock>
              <LikeButton
                size={'small'}
                isLiked={isLiked}
                onClick={toggleLike}
                disabled={authUser == null}
              />
              {likeCount !== 0 ? (
                <LikeCount>{likeCount.toLocaleString()}</LikeCount>
              ) : null}
            </LikeBlock>

            <ReplyBlock>
              <ReplyButton size={'small'} onClick={onReply} />
              답글
            </ReplyBlock>
          </CommentFooter>

          {getSubcommentsOrNull({ isRootComment, hasSubcomments })}
        </>
      )}
    </Block>
  )

  function getSubcommentsOrNull({
    isRootComment,
    hasSubcomments,
  }: GetSubcommentsOrNull) {
    return isRootComment && hasSubcomments ? (
      <SubcommentList commentList={subcommentList} />
    ) : null
  }
}
export default CommentElement

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().direction('column').create()};
  ${Font.style()
    .size('14px')
    .weight(600)
    .color(globalColors.grey2)
    .letterSpacing('-0.5px')
    .create()};
`

// Header

const CommentHead = styled.div`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('space-between')
    .create()};
  font-weight: 500;
`

const LeftGroup = styled.div`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('flex-end')
    .create()};
  gap: 4px;
`

const Username = styled.div`
  color: ${globalColors.grey3};
`

const Time = styled.div`
  ${Font.style().size('12px').weight(400).color(globalColors.grey2).create()};
`

const MoreButton = styled.button`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  width: 24px;
  height: 24px;
  color: ${globalColors.grey4};
  svg {
    width: 14px;
    height: 14px;
    //transform: rotateZ(90deg);
  }
`

// Content

const Mention = styled.span`
  color: ${appColors.primary1};
  margin-right: 6px;
`

const CommentText = styled.p`
  ${Font.style()
    .size('14px')
    .color(globalColors.grey6)
    .lineHeight(1.6)
    .whiteSpace('pre-wrap')
    .wordBreak('keep-all')
    .create()};
  margin: 0;
  margin-bottom: 4px;
`

const DeletedComment = styled(CommentText)`
  color: ${globalColors.grey2};
  margin: 0;
`

// Footer

const CommentFooter = styled.div`
  ${Flex.Container.style(true).create()};
  ${Font.style()
    .size('12px')
    .weight(600)
    .color(globalColors.grey2)
    .lineHeight(1)
    .create()};
  gap: 10px;
`

const LikeBlock = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  ${Font.style().weight(700).color(globalColors.grey4).create()};
  gap: 4px;
  & svg {
    color: ${globalColors.grey2};
  }
`

const LikeCount = styled.span`
  min-width: 16px;
`

const ReplyBlock = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  gap: 2px;
  & svg {
    color: ${globalColors.grey2};
  }
`

// types

type CommentType = 'root' | 'sub'

type GetSubcommentsOrNull = {
  isRootComment: boolean
  hasSubcomments: boolean
}
