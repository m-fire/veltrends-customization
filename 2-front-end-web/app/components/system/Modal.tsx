import React, { ReactNode } from 'react'
import Overlay from '~/components/system/Overlay'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

type ModalProps = {
  children?: ReactNode
}

function Modal({ children }: ModalProps) {
  return (
    <>
      <Overlay />
      <Positioner>
        <AnimatePresence>
          <Block
            initial={{ y: '30vh', opacity: 0 }}
            animate={{ y: '0vh', opacity: 1 }}
            exit={{ y: '30vh', opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.22 }}
          >
            {children}
          </Block>
        </AnimatePresence>
      </Positioner>
    </>
  )
}
export default Modal

// Inner Components

const Positioner = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Block = styled(motion.div)`
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
`
