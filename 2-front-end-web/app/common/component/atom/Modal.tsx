import React, { JSXElementConstructor, ReactNode } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { OverlayProps } from '~/common/component/atom/Overlay'

export type ModalProps = OverlayProps & {
  overlay: JSXElementConstructor<OverlayProps>
  className?: string
  children: ReactNode
}

function Modal({
  overlay: OverlayConstructor,
  onClick,
  visible,
  className,
  children,
}: ModalProps) {
  return (
    <Block>
      <OverlayConstructor onClick={onClick} visible={visible} />
      <Positioner>
        <AnimatePresence>
          {visible ? (
            <Content
              className={className}
              initial={{ y: '10vh', opacity: 0 }}
              animate={{ y: '0vh', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.32 }}
            >
              {children}
            </Content>
          ) : null}
        </AnimatePresence>
      </Positioner>
    </Block>
  )
}
export default Modal

// Inner Components

const Block = styled.div``

const Positioner = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Content = styled(motion.div)`
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.4);
`
