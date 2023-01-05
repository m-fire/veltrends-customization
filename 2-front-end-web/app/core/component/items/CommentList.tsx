import styled from 'styled-components'
import { Comment } from '~/core/api/types'
import CommentInput from '~/core/component/items/CommentInput'
import { colors } from '~/common/style/colors'
import CommentElement from '~/core/component/items/CommentElement'
import Flex from '~/common/style/css-flex'
import Font from '~/common/style/css-font'

type CommentListProps = {
  commentList: Comment[]
}

function CommentList({ commentList }: CommentListProps) {
  return (
    <Block>
      <CommentTitle>댓글 {commentList.length ?? 0}</CommentTitle>
      {/* Todo: 데스크탑 환경에서는 댓글오버레이 대신, UI 자체적으로 text input 기능수행 구현 */}
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
  ${Font.style()
    .size('16px')
    .weight(800)
    .color(colors.grey6)
    .lineHeight(1.5)
    .letterSpacing('-0.5px')
    .create()};
  margin: 0;
  margin-bottom: 8px;
`

const List = styled.div`
  ${Flex.Container.style().direction('column').create()};
  width: 100%;
  margin-top: 32px;
  gap: 40px;
`
