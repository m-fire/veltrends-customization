import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import { displayFlex } from '~/components/home/LinkCard'
import { colors } from '~/common/style/colors'
import LikeButton from '~/components/system/LikeButton'
import React from 'react'
import ReplyButton from '~/components/system/ReplyButton'
import SubcommentList from '~/components/items/SubcommentList'

export interface CommentItemProps {
  type: CommentType
  comment: Comment
  toggleLike: (params: ToggleLikeParams) => void
  onReply: (params: OnReplyParams) => void
}

function CommentItem({ comment, type, toggleLike, onReply }: CommentItemProps) {
  const {
    id: commentId,
    user,
    text,
    createdAt,
    likeCount,
    subcommentCount,
    subcommentList = [],
    mentionUser,
  } = comment

  const pastDistance = useDateDistance(createdAt)

  const isMainComment = type === 'root'
  const hasSubcomment = subcommentCount > 0
  const isLiked = false

  const handleToggleLike = () => toggleLike({ commentId })
  const handleOnReply = () => onReply({ commentId })

  return (
    <Block>
      <CommentHead>
        <Username onClick={handleOnReply}>{user.username}</Username>·
        <Time>{pastDistance}</Time>
      </CommentHead>

      <Text>
        {mentionUser != null ? (
          <Mention onClick={handleOnReply}>@{mentionUser.username}</Mention>
        ) : null}
        {text}
      </Text>

      <CommentFooter>
        <LikeBlock>
          <LikeButton
            size={'small'}
            isLiked={isLiked}
            onClick={handleToggleLike}
          />
          {likeCount !== 0 ? (
            <LikeCount>{likeCount.toLocaleString()}</LikeCount>
          ) : null}
          {/*<LikeCount>{likeCount.toLocaleString()}</LikeCount>*/}
        </LikeBlock>

        <ReplyBlock onClick={handleOnReply}>
          <ReplyButton size={'small'} />
          답글
        </ReplyBlock>
      </CommentFooter>

      {isMainComment && hasSubcomment ? (
        <SubcommentList
          commentList={subcommentList}
          toggleLike={toggleLike}
          onReply={onReply}
        />
      ) : null}
    </Block>
  )
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

const Text = styled.p`
  font-size: 14px;
  color: ${colors.grey6};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: keep-all;
  margin: 0;
  margin-bottom: 4px;
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
