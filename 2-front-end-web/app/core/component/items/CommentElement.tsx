import styled from 'styled-components'
import { Comment } from '~/core/api/types'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { colors } from '~/common/style/colors'
import LikeButton from '~/common/component/system/LikeButton'
import React from 'react'
import ReplyButton from '~/common/component/system/ReplyButton'
import SubcommentList from '~/core/component/items/SubcommentList'
import useCommentInputStore from '~/core/hook/store/useCommentInputStore'
import { useOverrideCommendById } from '~/core/hook/store/useOverrideCommentStore'
import { useLikeCommentAction } from '~/core/hook/useActionOfComment'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useAuthUser } from '~/common/context/UserContext'
import { useItemIdParams } from '~/core/hook/useItemIdParams'
import AppError from '~/common/error/AppError'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { MoreVert } from '~/core/component/generate/svg'
import useBottomSheetModalStore from '~/common/hook/store/useBottomSheetModalStore'
import { useDeleteComment } from '~/core/hook/useDeleteComment'

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

  const commentStoreState = useOverrideCommendById(commentId)

  //좋아요: 인증사용자인 경우 좋아요 허용, 없다면 로그인유도
  const likeCount = commentStoreState?.likeCount ?? comment.likeCount
  const { likeComment, unlikeComment } = useLikeCommentAction()
  const openDialog = useOpenDialog({ gotoLogin: true })
  const authUser = useAuthUser()
  const isLiked = commentStoreState?.isLiked ?? comment.isLiked
  const itemId = useItemIdParams()
  const toggleLike = async () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (authUser == null) {
      openDialog('LIKE_COMMENT>>LOGIN')
      return
    }
    if (isLiked) {
      await unlikeComment({ itemId, commentId, prevLikeCount: likeCount })
    } else {
      await likeComment({ itemId, commentId, prevLikeCount: likeCount })
    }
  }

  //댓글달기: 인증사용자인 경우 댓글달기 UI 제공, 없다면 로그인유도

  const inputStoreAction = useCommentInputStore((store) => store.action)

  const onReply = () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (authUser == null) {
      openDialog('COMMENT_INPUT>>LOGIN')
      return
    }
    writeComment(commentId)
  }

  const deleteComment = useDeleteComment()
  const onClickMore = () => {
    openCommentModifiedModal([
      {
        name: '수정',
        onClick: () => inputStoreAction.edit(commentId, text),
      },
      {
        name: '삭제',
        onClick: async () => {
          await deleteComment(commentId)
        },
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
              />
              {likeCount !== 0 ? (
                <LikeCount>{likeCount.toLocaleString()}</LikeCount>
              ) : null}
            </LikeBlock>

            <ReplyBlock onClick={onReply}>
              <ReplyButton size={'small'} />
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
  ${flexStyles({ direction: 'column' })};
  ${fontStyles({
    size: '14px',
    weight: 600,
    color: colors.grey2,
    letterSpacing: '-0.5px',
  })};
`

// Header

const CommentHead = styled.div`
  ${flexStyles({ alignItems: 'center', justifyContent: 'space-between' })};
  font-weight: 500;
`

const LeftGroup = styled.div`
  ${flexStyles({ alignItems: 'center', justifyContent: 'flex-end' })};
  gap: 4px;
`

const Username = styled.div`
  color: ${colors.grey3};
`

const Time = styled.div`
  ${fontStyles({ size: '12px', weight: 400, color: colors.grey2 })};
`

const MoreButton = styled.button`
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })};
  width: 24px;
  height: 24px;
  color: ${colors.grey4};
  svg {
    width: 14px;
    height: 14px;
    //transform: rotateZ(90deg);
  }
`

// Content

const Mention = styled.span`
  color: ${colors.primary1};
  margin-right: 6px;
`

const CommentText = styled.p`
  ${fontStyles({ size: '14px', color: colors.grey6, lineHeight: 1.6 })};
  white-space: pre-wrap;
  word-break: keep-all;
  margin: 0;
  margin-bottom: 4px;
`

const DeletedComment = styled(CommentText)`
  color: ${colors.grey2};
  margin: 0;
`

// Footer

const CommentFooter = styled.div`
  ${flexStyles({ display: 'inline-flex' })};
  ${fontStyles({
    size: '12px',
    weight: 600,
    color: colors.grey2,
    lineHeight: 1,
  })};
  gap: 10px;
`

const LikeBlock = styled.div`
  ${flexStyles({ alignItems: 'center' })};
  ${fontStyles({ weight: 700, color: colors.grey4 })};
  gap: 4px;
  & svg {
    color: ${colors.grey2};
  }
`

const LikeCount = styled.span`
  min-width: 16px;
`

const ReplyBlock = styled.div`
  ${flexStyles({ alignItems: 'center' })};
  gap: 2px;
  & svg {
    color: ${colors.grey2};
  }
`

// types

type CommentType = 'root' | 'sub'

type ToggleLikeParams = {
  commentId: number
}

type GetSubcommentsOrNull = {
  isRootComment: boolean
  hasSubcomments: boolean
}
