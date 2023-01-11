import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

export type OverlayProps = {
  onClick?: MouseEventHandler<HTMLElement>
}

function Overlay({ onClick }: OverlayProps) {
  return (
    <AnimatePresence initial={false}>
      <Fill
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
      />
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
  height: -webkit-fill-available; // safari browser 100vh 이슈해결용
  background-color: rgba(0, 0, 0, 0.6);
`
