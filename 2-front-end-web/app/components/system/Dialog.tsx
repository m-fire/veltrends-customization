import React from 'react'
import styled from 'styled-components'
import Modal from '~/components/system/Modal'
import { colors } from '~/common/style/colors'

export type DialogProps = {
  textConfig: {
    title: string
    description: string
    confirmText: string
    cancelText: string
  }
  onConfirm: () => void
  onClose: () => void
  visible: boolean
}

function Dialog({
  textConfig: { title, description, confirmText, cancelText },
  onConfirm,
  onClose,
  visible,
}: DialogProps) {
  return (
    <StyledModal visible={visible}>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </StyledModal>
  )
}
export default Dialog

// Inner Components

const StyledModal = styled(Modal)`
  width: 375px;
  max-width: calc(100vw - 32px);
  padding: 16px 20px;
`

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: ${colors.grey5};
  line-height: 1.5;
`

const Description = styled.p`
  margin-top: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.grey2};
  line-height: 1.5;
  white-space: pre-wrap;
`
