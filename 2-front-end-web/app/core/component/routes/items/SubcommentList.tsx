import styled from 'styled-components'
import { Comment } from '~/core/api/types'
import CommentElement from '~/core/component/routes/items/CommentElement'
import { globalColors } from '~/common/style/global-colors'
import { Flex } from '~/common/style/css-builder'

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
  ${Flex.Container.style().direction('column').create()};
  padding: 24px 0 0 48px;
  gap: 24px;
`

const EndLine = styled.hr`
  margin: 0;
  width: 100%;
  background-color: ${globalColors.grey1};
  border: solid 2px ${globalColors.grey1};
`
