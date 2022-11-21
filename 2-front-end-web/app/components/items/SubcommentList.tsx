import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import CommentItem, { CommentItemProps } from '~/components/items/CommentItem'
import { displayFlex } from '~/components/home/LinkCard'
import { colors } from '~/common/style/colors'

type SubcommentListProps = {
  commentList: Comment[]
  toggleLike: CommentItemProps['toggleLike']
  onReply: CommentItemProps['onReply']
}

function SubcommentList({
  commentList,
  toggleLike,
  onReply,
}: SubcommentListProps) {
  return (
    <List>
      {commentList.map((comment) => (
        <CommentItem
          type="sub"
          comment={comment}
          key={comment.id}
          toggleLike={toggleLike}
          onReply={onReply}
        />
      ))}
      <EndLine />
    </List>
  )
}
export default SubcommentList

// Inner Components

const List = styled.div`
  ${displayFlex({ direction: 'column' })};
  padding: 24px 0 0 48px;
  gap: 24px;
`

const EndLine = styled.hr`
  margin: 0;
  width: 100%;
  background-color: ${colors.grey1};
  border: solid 2px ${colors.grey1};
`
