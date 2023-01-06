import styled from 'styled-components'
import { colors } from '~/core/style/colors'
import { useAuthUser } from '~/common/context/UserContext'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useCommentInputAction } from '~/core/hook/useCommentAction'
import { Flex, Font } from '~/common/style/css-builder'

type CommentInputParams = {}

function CommentInput({}: CommentInputParams) {
  const authUser = useAuthUser()
  const openDialog = useOpenDialog()
  const { writeComment } = useCommentInputAction()

  const onClick = () => {
    if (authUser == null) {
      openDialog('WRITE_COMMENT', { gotoLogin: true })
      return
    }
    writeComment(null)
  }

  return <PseudoInput onClick={onClick}>댓글을 입력하세요</PseudoInput>
}

const PseudoInput = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  ${Font.style().size('14px').color(colors.grey1).create()};
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${colors.grey2};
  padding: 12px 40px 12px 12px;
`

export default CommentInput
