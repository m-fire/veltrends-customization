import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import useCommentInputStore from '~/core/hook/store/useCommentInputStore'
import { useAuthUser } from '~/common/context/UserContext'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { flexStyles, fontStyles } from '~/common/style/styled'

type CommentInputParams = {}

function CommentInput({}: CommentInputParams) {
  const authUser = useAuthUser()
  const openDialog = useOpenDialog({ gotoLogin: true })
  const writeComment = useCommentInputStore((store) => store.action.write)

  const onClick = () => {
    if (authUser == null) {
      openDialog('COMMENT_INPUT>>LOGIN')
      return
    }
    writeComment()
  }

  return <PseudoInput onClick={onClick}>댓글을 입력하세요</PseudoInput>
}

const PseudoInput = styled.div`
  ${flexStyles({ alignItems: 'center' })};
  ${fontStyles({ size: '14px', color: colors.grey1 })};
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${colors.grey2};
  padding: 12px 40px 12px 12px;
`

export default CommentInput
