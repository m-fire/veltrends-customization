import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import Overlay from '../system/Overlay'
import { useCommentInputStore } from '~/common/hooks/store/useCommentInputStore'
import { displayFlex } from '~/components/home/LinkCard'
import { SpeechBubble } from '~/components/generate/svg'
import { colors } from '~/common/style/colors'
import { useEffect, useState } from 'react'
import Spinner from '~/components/system/Spinner'
import { useItemIdParams } from '~/common/hooks/useItemIdParams'
import { useCreateCommentMutation } from '~/common/hooks/mutation/useCreateCommentMutation'

type CommentInputOverlayParams = {}

function CommentInputOverlay({}: CommentInputOverlayParams) {
  const inputStore = useCommentInputStore()

  const { close: closeCommentInput } = inputStore
  const createCommentMutation = useCreateCommentMutation({
    onSuccess(data) {
      // @todo: do sth with data
      console.log('hello world')
      closeCommentInput()
    },
  })

  const [text, setText] = useState('')
  const { mutate } = createCommentMutation
  const itemId = useItemIdParams()
  const onClick = () => {
    if (!itemId) return
    mutate({
      itemId,
      text,
    })
  }

  const { visible } = inputStore
  useEffect(() => {
    if (visible) {
      setText('')
    }
  }, [visible])

  const { isLoading } = createCommentMutation
  return (
    <>
      <Overlay onClick={closeCommentInput} visible={visible} />
      <AnimatePresence initial={false}>
        {visible && (
          <Footer
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{
              damping: 0 /* 에니메이션 제동 */,
            }}
          >
            <StyledInput
              value={text}
              placeholder="댓글을 입력하세요"
              onChange={(e) => setText(e.target.value)}
              autoFocus={true}
            />
            <TransparentButton onClick={onClick} disabled={isLoading}>
              {isLoading ? <StyledSpinner /> : <StyledSpeechBubble />}
            </TransparentButton>
          </Footer>
        )}
      </AnimatePresence>
    </>
  )
}
export default CommentInputOverlay

// Inner components

const Footer = styled(motion.div)`
  ${displayFlex({ alignItems: 'center' })};
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  background: white;
  padding: 2px 2px;
`

const StyledInput = styled.input`
  height: 100%;
  flex: 1;
  border: none;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 400;
  &::placeholder {
    color: ${colors.grey1};
  }
`

const TransparentButton = styled.button`
  ${displayFlex({ alignItems: 'center', justifyContent: 'center' })};
  height: 100%;
  background: none;
  border: none;
  outline: none;
  padding: 0 8px;
  position: relative;
`

const StyledSpeechBubble = styled(SpeechBubble)`
  width: 24px;
  height: 24px;
  color: ${colors.primary1};
`

const StyledSpinner = styled(Spinner)`
  width: 24px;
  height: 24px;
  color: ${colors.primary1};
`
