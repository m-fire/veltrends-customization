import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { displayFlex, fontStyles } from '~/components/home/LinkCard'
import { CommentItemProps } from '~/components/items/CommentItem'

type CommentInputParams = {
  onReply: CommentItemProps['onReply']
}

function CommentInput({}: CommentInputParams) {
  return <PseudoInput>댓글을 입력하세요</PseudoInput>
}

const PseudoInput = styled.div`
  ${displayFlex({ alignItems: 'center' })}
  ${fontStyles({ size: '14px', color: colors.grey1 })}
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${colors.grey2};
  padding: 12px 40px 12px 12px;
`

export default CommentInput
