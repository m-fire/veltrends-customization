import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import CommentInput from '~/components/items/CommentInput'
import { colors } from '~/common/style/colors'
import CommentElement from '~/components/items/CommentElement'
import { flexStyles, fontStyles } from '~/common/style/styled'

type CommentListProps = {
  commentList: Comment[]
}

function CommentList({ commentList }: CommentListProps) {
  return (
    <Block>
      <CommentTitle>댓글 {commentList.length ?? 0}</CommentTitle>
      <CommentInput />
      <List>
        {commentList.map((comment) => (
          <CommentElement type="root" comment={comment} key={comment.id} />
        ))}
      </List>
    </Block>
  )
}
export default CommentList

// Inner Components

const Block = styled.div`
  padding: 16px 30px;
`

const CommentTitle = styled.h3`
  ${fontStyles({
    size: '16px',
    weight: 800,
    color: colors.grey6,
    lineHeight: 1.5,
    letterSpacing: '-0.5px',
  })}
  margin: 0;
  margin-bottom: 8px;
`

const List = styled.div`
  ${flexStyles({ direction: 'column' })};
  width: 100%;
  margin-top: 32px;
  gap: 40px;
`
