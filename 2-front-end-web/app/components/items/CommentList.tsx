import styled from 'styled-components'
import { Comment } from '~/common/api/types'
import CommentInput from '~/components/items/CommentInput'
import { displayFlex, fontStyles } from '~/components/home/LinkCard'
import { colors } from '~/common/style/colors'
import CommentItem from '~/components/items/CommentItem'

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
          <CommentItem type="root" comment={comment} key={comment.id} />
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
  ${displayFlex({ direction: 'column' })}
  width: 100%;
  margin-top: 32px;
  gap: 40px;
`
