import React, { JSXElementConstructor } from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import Modal from '~/common/component/atom/Modal'
import Overlay, { OverlayProps } from '~/common/component/atom/Overlay'
import { Flex, Font } from '~/common/style/css-builder'
import { globalColors } from '~/common/style/global-colors'
import VariantLinkButton from '~/core/component/VariantLinkButton'

export type DialogProps = {
  overlay: JSXElementConstructor<OverlayProps>
  mode?: 'OK' | 'YESNO'
  textMap: {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
  }
  customStyles?: {
    modal?: FlattenSimpleInterpolation
    header?: FlattenSimpleInterpolation
    description?: FlattenSimpleInterpolation
    footer?: FlattenSimpleInterpolation
    buttons?: FlattenSimpleInterpolation
  }
  onConfirm: () => void
  onCancel: () => void
  visible: boolean
}

function Dialog({
  overlay = Overlay,
  mode = 'OK',
  textMap: { title, description, confirmText = '확인', cancelText = '닫기' },
  customStyles,
  onConfirm,
  onCancel,
  visible,
}: DialogProps) {
  const updatedStyles = {
    //
    modal: { ...initialStyles.modal, ...customStyles?.modal },
    header: { ...initialStyles.header, ...customStyles?.header },
    description: { ...initialStyles.description, ...customStyles?.description },
    footer: { ...initialStyles.footer, ...customStyles?.footer },
    buttons: { ...initialStyles.button, ...customStyles?.buttons },
  } as DialogProps['customStyles']

  return (
    <StyledModal
      overlay={overlay}
      visible={visible}
      styles={updatedStyles?.modal}
    >
      <Header styles={updatedStyles?.modal}>{title}</Header>
      <Description styles={updatedStyles?.description}>
        {description}
      </Description>
      <Footer styles={updatedStyles?.footer}>
        {mode === 'OK' ? (
          <>
            <VariantLinkButton
              variant="primary"
              onClick={onConfirm}
              $customStyle={updatedStyles?.buttons}
            >
              {confirmText}
            </VariantLinkButton>
          </>
        ) : (
          <>
            <VariantLinkButton
              variant="textonly"
              onClick={onCancel}
              $customStyle={updatedStyles?.buttons}
            >
              {cancelText}
            </VariantLinkButton>
            <VariantLinkButton
              variant="primary"
              onClick={onConfirm}
              $customStyle={updatedStyles?.buttons}
            >
              {confirmText}
            </VariantLinkButton>
          </>
        )}
      </Footer>
    </StyledModal>
  )
}
export default Dialog

// Inner Components

const StyledModal = styled(Modal)<{ styles?: FlattenSimpleInterpolation }>`
  ${({ styles }) => styles}; //  custom
`

const Header = styled.h3<{ styles?: FlattenSimpleInterpolation }>`
  ${({ styles }) => styles};
`

const Description = styled.p<{ styles?: FlattenSimpleInterpolation }>`
  ${({ styles }) => styles};
`

const Footer = styled.section<{ styles?: FlattenSimpleInterpolation }>`
  ${({ styles }) => styles};
`

const initialStyles = {
  modal: css`
    width: 375px;
    max-width: calc(100vw - 32px);
    padding: 16px 20px;
  `,
  header: css`
    ${Font.style()
      .size('20px')
      .weight(800)
      .color(globalColors.grey4)
      .lineHeight(1.5)
      .textAlign('center')
      .create()};
    margin-top: 0;
    margin-bottom: 8px;
  `,
  description: css`
    ${Font.style()
      .size('14px')
      .weight(600)
      .color(globalColors.grey2)
      .lineHeight(1.5)
      .whiteSpace('pre-wrap')
      .create()};
    margin-top: 0;
  `,
  footer: css`
    ${Flex.Container.style().justifyContent('flex-end').create()};
    margin-top: 16px;
  `,
  button: css`
    ${Font.style().size('14px').create()};
    width: 70px;
    height: 35px;
    border-radius: 999px;
  `,
}
