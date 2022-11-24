import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import Overlay from '../system/Overlay'
import { useCommentInputStore } from '~/common/hooks/store/useCommentInputStore'
import { displayFlex } from '~/components/home/LinkCard'
import { SpeechBubble } from '~/components/generate/svg'
import { colors } from '~/common/style/colors'

type CommentInputOverlayParams = {}

function CommentInputOverlay({}: CommentInputOverlayParams) {
  const { visible, close: closeCommentInput } = useCommentInputStore(
    (store) => store,
  )
  const onClick = () => {
    closeCommentInput()
  }

  return (
    <>
      <Overlay onClick={onClick} visible={visible} />
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
            <StyledInput placeholder="댓글을 입력하세요" autoFocus={true} />
            <TransparentButton onClick={onClick}>
              <StyledSpeechBubble />
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
`

const StyledSpeechBubble = styled(SpeechBubble)`
  width: 24px;
  height: 24px;
  color: ${colors.primary1};
`
