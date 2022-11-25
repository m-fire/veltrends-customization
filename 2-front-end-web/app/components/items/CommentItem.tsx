import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import { displayFlex } from '~/components/home/LinkCard'
import { colors } from '~/common/style/colors'
import LikeButton from '~/components/system/LikeButton'
import React from 'react'
import ReplyButton from '~/components/system/ReplyButton'
import SubcommentList from '~/components/items/SubcommentList'
import { useCommentInputStore } from '~/common/hooks/store/useCommentInputStore'

export interface CommentItemProps {
  type: CommentType
  comment: Comment
}

function CommentItem({ comment, type }: CommentItemProps) {
  const {
    id: commentId,
    user,
    text,
    createdAt,
    likeCount,
    subcommentList = [],
    mentionUser,
    isDeleted,
  } = comment

  const isRootComment = type === 'root'
  const hasSubcomments = subcommentList.length > 0
  const isLiked = false

  const { open: openCommentInput } = useCommentInputStore()
  const onReply = () => {
    openCommentInput(commentId)
  }

  const toggleLike = () => {
    window.alert('좋아요')
  }

  const pastDistance = useDateDistance(createdAt)
  return (
    <Block data-comment-id={comment.id}>
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
export default CommentItem

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
