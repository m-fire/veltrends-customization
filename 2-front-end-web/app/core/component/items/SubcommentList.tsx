import styled from 'styled-components'
import { Comment } from '~/core/api/types'
import CommentElement from '~/core/component/items/CommentElement'
import { colors } from '~/common/style/colors'
import { flexContainer } from '~/common/style/styled'

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
  ${flexContainer({ direction: 'column' })};
  padding: 24px 0 0 48px;
  gap: 24px;
`

const EndLine = styled.hr`
  margin: 0;
  width: 100%;
  background-color: ${colors.grey1};
  border: solid 2px ${colors.grey1};
`
