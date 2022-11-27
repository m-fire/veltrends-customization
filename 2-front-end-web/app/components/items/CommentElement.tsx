import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import { colors } from '~/common/style/colors'
import LikeButton from '~/components/system/LikeButton'
import React from 'react'
import ReplyButton from '~/components/system/ReplyButton'
import SubcommentList from '~/components/items/SubcommentList'
import { useCommentInputStore } from '~/common/hooks/store/useCommentInputStore'
import { useOverrideCommendById } from '~/common/hooks/store/useOverrideCommentStore'
import { useLikeCommentAction } from '~/common/hooks/useActionOfComment'
import { useOpenDialog } from '~/common/hooks/useOpenDialog'
import { useAuthUser } from '~/common/context/UserContext'
import { useItemIdParams } from '~/common/hooks/useItemIdParams'
import AppError from '~/common/error/AppError'
import { displayFlex } from '~/common/style/styled'

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
  const { open: openCommentInput } = useCommentInputStore()
  const onReply = () => {
    if (itemId == null) throw new AppError('BadRequest')

    if (authUser == null) {
      openDialog('COMMENT_INPUT>>LOGIN')
      return
    }
    openCommentInput(commentId)
  }

  const pastDistance = useDateDistance(createdAt)
  const hasSubcomments = subcommentList.length > 0
  const isRootComment = type === 'root'

  return (
    <Block data-comment-id={commentId}>
      {isDeleted ? (
        <>
          <DeletedCommentMessage>· 삭제된 댓글입니다 ·</DeletedCommentMessage>
          {getSubcommentsOrNull({ isRootComment, hasSubcomments })}
        </>
      ) : (
        <>
          <CommentHead>
            <Username>{user.username}</Username> · <Time>{pastDistance}</Time>
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
  ${displayFlex({ direction: 'column' })};
  font-size: 14px;
  font-weight: 600;
  color: ${colors.grey2};
  letter-spacing: -0.5px;
`

// Header

const CommentHead = styled.div`
  ${displayFlex({ alignItems: 'center' })};
  font-weight: 500;
  gap: 4px;
`

const Username = styled.div`
  color: ${colors.grey3};
`

const Time = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${colors.grey2};
`

// Content

const Mention = styled.span`
  color: ${colors.primary1};
  margin-right: 6px;
`

const CommentText = styled.p`
  font-size: 14px;
  color: ${colors.grey6};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: keep-all;
  margin: 0;
  margin-bottom: 4px;
`

const DeletedCommentMessage = styled(CommentText)`
  color: ${colors.grey2};
  margin: 0;
`

// Footer

const CommentFooter = styled.div`
  display: inline-flex;
  color: ${colors.grey3};
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  gap: 10px;
`

const LikeBlock = styled.div`
  ${displayFlex({ alignItems: 'center' })};
  color: ${colors.grey4};
  font-weight: 700;
  gap: 4px;
  & svg {
    color: ${colors.grey2};
  }
`

const LikeCount = styled.span`
  min-width: 16px;
`

const ReplyBlock = styled.div`
  ${displayFlex({ alignItems: 'center' })};
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

type OnReplyParams = ToggleLikeParams

type GetSubcommentsOrNull = {
  isRootComment: boolean
  hasSubcomments: boolean
}
