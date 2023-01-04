import React from 'react'
import styled from 'styled-components'
import Modal from '~/common/component/system/Modal'
import { colors } from '~/common/style/colors'
import Button from '~/common/component/system/Button'
import { flexContainer, fontStyles } from '~/common/style/styled'

export type DialogProps = {
  mode?: 'OK' | 'YESNO'
  textMap: {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
  }
  onConfirm: () => void
  onCancel: () => void
  visible: boolean
}

function Dialog({
  mode = 'OK',
  textMap: { title, description, confirmText = '확인', cancelText = '닫기' },
  onConfirm,
  onCancel,
  visible,
}: DialogProps) {
  return (
    <StyledModal visible={visible}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Footer>
        {mode === 'OK' ? (
          <StyledButton variant="primary" onClick={onConfirm}>
            {confirmText}
          </StyledButton>
        ) : (
          <>
            <StyledButton variant="nobg" onClick={onCancel}>
              {cancelText}
            </StyledButton>
            <StyledButton variant="primary" onClick={onConfirm}>
              {confirmText}
            </StyledButton>
          </>
        )}
      </Footer>
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
  ${fontStyles({
    size: '20px',
    weight: 800,
    color: colors.grey5,
    lineHeight: 1.5,
  })};
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
`

const Description = styled.p`
  ${fontStyles({
    size: '14px',
    weight: 600,
    color: colors.grey2,
    lineHeight: 1.5,
  })};
  margin-top: 0;
  white-space: pre-wrap;
`

const Footer = styled.section`
  ${flexContainer({ justifyContent: 'flex-end' })};
  margin-top: 16px;
`

const StyledButton = styled(Button)`
  ${fontStyles({ size: '14px' })};
  width: 70px;
  height: 35px;
  border-radius: 999px;
`
