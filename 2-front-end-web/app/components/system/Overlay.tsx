import React from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

type OverlayProps = {
  visible: boolean
}

function Overlay({ visible }: OverlayProps) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <Fill
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </AnimatePresence>
  )
}
export default Overlay

// Inner Components

const Fill = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available; // safari browser 100vh 이슈해결
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 0 100px 0 rgba(0, 0, 0, 1);
`
