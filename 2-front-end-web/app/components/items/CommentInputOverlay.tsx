import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import Overlay from '../system/Overlay'
import { useCommentInputStore } from '~/common/hooks/store/useCommentInputStore'

type CommentInputOverlayParams = {}

function CommentInputOverlay({}: CommentInputOverlayParams) {
  const visible = useCommentInputStore((store) => store.visible)

  return (
    <>
      <Overlay visible={visible} />
      <AnimatePresence initial={false}>
        {visible && (
          <Footer
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{
              damping: 0 /* 에니메이션 제동 */,
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
export default CommentInputOverlay

// Inner components

const Footer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 48px;
  background: white;
`
