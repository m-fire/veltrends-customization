import React, { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { Flex } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'

type FooterProps = {
  height: Required<CSSProperties['height']>
  children?: ReactNode
  [key: string]: any
}

function Footer({ height, children, ...rest }: FooterProps) {
  return (
    <StyledFooter height={height} {...rest}>
      {children}
    </StyledFooter>
  )
}
export default Footer

// Inner Components

const StyledFooter = styled.footer<FooterProps>`
  ${Flex.Container.style().create()};
  height: ${({ height }) =>
    typeof height == 'string' ? height : `${height}px`};
  border-top: 1px solid ${globalColors.grey1};

  ${Media.minWidth.desktop} {
    // 데스크탑/모바일 스크린사이즈에 따라 보여짐/사라짐
    display: none;
  }
`
