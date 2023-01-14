import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { Filters } from '~/common/style/css-builder'

export type OverlayProps = {
  visible: boolean
  onClick?: MouseEventHandler<HTMLElement>
}

function Overlay({ visible, onClick }: OverlayProps) {
  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <Fill
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClick}
        />
      ) : null}
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
  ${Filters.backdrop().blur(4).create()};
`
