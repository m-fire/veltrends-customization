import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import { displayFlex } from '~/components/home/LinkCard'
import { colors } from '~/common/style/colors'
import { AnimatePresence, motion } from 'framer-motion'
import LikeButton from '~/components/system/LikeButton'
import React from 'react'
import CommentButton from '~/components/system/CommentButton'
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
    likes,
    subcommentCount,
    subcommentList = [],
    mentionUser,
  } = comment

  const pastDistance = useDateDistance(createdAt)

  const isMainComment = type === 'main'
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

      <ReplyMenu>
        <ReplyItem>
          <AnimatePresence initial={false}>
            <LikeButton onClick={handleToggleLike} isLiked={isLiked} />
            <LikeCount
              key="likes"
              initial={{ height: 0, opacity: 0, y: 10 }}
              animate={{ height: 22, opacity: 1, y: 0 }}
              transition={{ stiffness: 100 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {likes !== 0 ? likes.toLocaleString() : null}
            </LikeCount>
          </AnimatePresence>
        </ReplyItem>

        <ReplyItem>
          <CommentButton onClick={handleOnReply} />
          답글
        </ReplyItem>
      </ReplyMenu>

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

const CommentHead = styled.div`
  ${displayFlex({ alignItems: 'center' })};
  font-weight: 500;
  gap: 4px;
  margin: 0;
`

const Username = styled.div`
  color: ${colors.grey3};
`

const Time = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${colors.grey2};
`

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.grey5};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: keep-all;
`
const Mention = styled.span`
  color: ${colors.primary1};
  margin-right: 4px;
`

const ReplyMenu = styled.div`
  ${displayFlex()};
  padding-top: 8px;
  gap: 12px;
`

const ReplyItem = styled.div`
  ${displayFlex({ alignItems: 'center', justifyContent: 'flex-start' })};
  font-size: 12px;
  gap: 4px;
`

const LikeCount = styled(motion.div)`
  display: flex;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.grey6};
  line-height: 1.5;
`

// types

type CommentType = 'main' | 'sub'

type ToggleLikeParams = {
  commentId: number
}

type OnReplyParams = ToggleLikeParams
