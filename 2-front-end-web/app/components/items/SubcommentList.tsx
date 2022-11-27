import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import CommentElement from '~/components/items/CommentElement'
import { displayFlex } from '~/components/home/LinkCard'
import { colors } from '~/common/style/colors'

type SubcommentListProps = {
  commentList: Comment[]
}

function SubcommentList({ commentList }: SubcommentListProps) {
  return (
    <List>
      {commentList.map((comment) => (
        <CommentElement type="sub" comment={comment} key={comment.id} />
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
