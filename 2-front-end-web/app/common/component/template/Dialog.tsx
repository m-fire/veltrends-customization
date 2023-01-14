import React, { JSXElementConstructor, useMemo } from 'react'
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
  customStyles?: Record<StyleNames, FlattenSimpleInterpolation>
  onConfirm: () => void
  onCancel: () => void
  visible: boolean
}

function Dialog({
  overlay,
  mode = 'OK',
  textMap: { title, description, confirmText = '확인', cancelText = '닫기' },
  customStyles,
  onConfirm,
  onCancel,
  visible,
}: DialogProps) {
  //
  const styles: DialogProps['customStyles'] = useMemo(
    () => ({
      modal: initialStyles.modal.concat(customStyles?.modal),
      header: initialStyles.header.concat(customStyles?.header),
      description: initialStyles.description.concat(customStyles?.description),
      footer: initialStyles.footer.concat(customStyles?.footer),
      buttons: initialStyles.buttons.concat(customStyles?.buttons),
    }),
    [],
  )

  return (
    <>
      <StyledModal
        overlay={overlay}
        onClick={onCancel}
        styles={styles?.modal}
        visible={visible}
      >
        <Header styles={styles?.header}>{title}</Header>
        <Description styles={styles?.description}>{description}</Description>
        <Footer styles={styles?.footer}>
          {mode === 'OK' ? (
            <VariantLinkButton
              variant="primary"
              onClick={onConfirm}
              customstyles={styles?.buttons}
            >
              {confirmText}
            </VariantLinkButton>
          ) : (
            <>
              <VariantLinkButton
                variant="textonly"
                onClick={onCancel}
                customstyles={styles?.buttons}
              >
                {cancelText}
              </VariantLinkButton>
              <VariantLinkButton
                variant="primary"
                onClick={onConfirm}
                customstyles={styles?.buttons}
              >
                {confirmText}
              </VariantLinkButton>
            </>
          )}
        </Footer>
      </StyledModal>
    </>
  )
}
export default Dialog

// Inner Components

const initialStyles = {
  modal: css`
    width: 375px;
    max-width: calc(100vw - 32px);
    padding: 16px 20px;
    z-index: 2;
  `,
  header: css`
    ${Font.style()
      .size(20)
      .weight(800)
      .color(globalColors.grey4)
      .lineHeight(1.5)
      .create()};
    margin-top: 0;
    margin-bottom: 8px;
  `,
  description: css`
    ${Font.style()
      .size(14)
      .weight(600)
      .color(globalColors.grey2)
      .lineHeight(1.5)
      .whiteSpace('pre-wrap')
      .create()};
    margin-top: 0;
  `,
  footer: css`
    ${Flex.container().justifyContent('flex-end').create()};
    margin-top: 16px;
  `,
  buttons: css`
    ${Font.style().size(14).create()};
    width: 70px;
    height: 35px;
    border-radius: 999px;
  `,
}
type StyleNames = keyof typeof initialStyles

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
