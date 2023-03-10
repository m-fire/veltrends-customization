import styled from 'styled-components'
import { Comment } from '~/core/api/types'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import LikeButton from '~/core/component/items/LikeButton'
import React from 'react'
import ReplyButton from '~/core/component/items/ReplyButton'
import SubcommentList from '~/core/component/items/SubcommentList'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useUserState } from '~/common/store/user'
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
  const { user } = useUserState()
  const isLiked = commentActionState?.isLiked ?? comment.isLiked
  const itemId = useItemIdParams()

  const toggleLike = async () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (user == null) {
      openDialog('LIKE_COMMENT', { gotoLogin: true })
      return
    }
    if (isLiked) {
      await unlikeComment({ itemId, commentId, likeCount, isLiked })
    } else {
      await likeComment({ itemId, commentId, likeCount, isLiked })
    }
  }

  //????????????: ?????????????????? ?????? ???????????? UI ??????, ????????? ???????????????

  const inputStateActions = useCommentInputAction()

  const onReply = () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (user == null) {
      openDialog('WRITE_COMMENT')
      return
    }
    inputStateActions.writeComment(commentId)
  }

  const deleteComment = useDeleteComment()
  const { open: openBottomModal } = useBottomSheetModalStore().action
  const onClickMore = () => {
    openBottomModal([
      {
        name: '??????',
        onClick: () => inputStateActions.editComment(commentId, text),
      },
      {
        name: '??????',
        onClick: () =>
          openDialog('DELETE_ITEM', {
            buttonTexts: {
              confirmText: '??????',
              cancelText: '??????',
            },
            onConfirm: async () => await deleteComment(commentId),
          }),
      },
    ])
  }

  const pastDistance = useDateDistance(createdAt)
  const hasSubcomments = subcommentList.length > 0
  const isMyComment = comment.user.id === user?.id
  const isRootComment = type === 'root'

  return (
    <Block data-comment-id={commentId}>
      {isDeleted ? (
        <>
          <DeletedComment>?? ????????? ??????????????? ??</DeletedComment>
          {getSubcommentsOrNull({ isRootComment, hasSubcomments })}
        </>
      ) : (
        <>
          <CommentHead>
            <LeftGroup>
              <Username>{user?.username}</Username> ??{' '}
              <Time>{pastDistance}</Time>
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
                disabled={user == null}
              />
              {likeCount !== 0 ? (
                <LikeCount>{likeCount.toLocaleString()}</LikeCount>
              ) : null}
            </LikeBlock>

            <ReplyBlock>
              <ReplyButton size={'small'} onClick={onReply} />
              ??????
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
  ${Flex.container().direction('column').create()};
  ${Font.style()
    .size(14)
    .weight(600)
    .color(globalColors.grey2)
    .letterSpacing('-0.5px')
    .create()};
`

// Header

const CommentHead = styled.div`
  ${Flex.container()
    .alignItems('center')
    .justifyContent('space-between')
    .create()};
  font-weight: 500;
`

const LeftGroup = styled.div`
  ${Flex.container().alignItems('center').justifyContent('flex-end').create()};
  gap: 4px;
`

const Username = styled.div`
  color: ${globalColors.grey3};
`

const Time = styled.div`
  ${Font.style().size(12).weight(400).color(globalColors.grey2).create()};
`

const MoreButton = styled.button`
  ${Flex.container().alignItems('center').justifyContent('center').create()};
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
    .size(14)
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
  ${Flex.container(true).create()};
  ${Font.style()
    .size(12)
    .weight(600)
    .color(globalColors.grey2)
    .lineHeight(1)
    .create()};
  gap: 10px;
`

const LikeBlock = styled.div`
  ${Flex.container().alignItems('center').create()};
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
  ${Flex.container().alignItems('center').create()};
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
