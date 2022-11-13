import React, { ReactNode } from 'react'
import Overlay from '~/components/system/Overlay'

type ModalProps = {
  children?: ReactNode
}

function Modal({ children }: ModalProps) {
  return <Overlay visible>{children}</Overlay>
}
export default Modal

// Inner Components
