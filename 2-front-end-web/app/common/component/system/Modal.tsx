import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Overlay from '~/common/component/system/Overlay'
import { AnimatePresence, motion } from 'framer-motion'

type ModalProps = {
  className?: string
  children: ReactNode
  visible: boolean
}

function Modal({ className, children, visible }: ModalProps) {
  return (
    <>
      <Overlay visible={visible} />
      <Positioner>
        <AnimatePresence>
          {visible ? (
            <Block
              className={className}
              initial={{ y: '10vh', opacity: 0 }}
              animate={{ y: '0vh', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.32 }}
            >
              {children}
            </Block>
          ) : null}
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
  z-index: 15;
`

const Block = styled(motion.div)`
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
`
