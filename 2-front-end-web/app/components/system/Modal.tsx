import React, { ReactNode } from 'react'
import Overlay from '~/components/system/Overlay'
import styled from 'styled-components'
import { motion } from 'framer-motion'

type ModalProps = {
  children?: ReactNode
}

function Modal({ children }: ModalProps) {
  return (
    <>
      <Overlay />
      <Positioner>
        <Block>{children}</Block>
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
`
