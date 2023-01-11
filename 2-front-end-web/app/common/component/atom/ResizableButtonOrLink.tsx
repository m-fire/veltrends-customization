import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, LinkProps } from '@remix-run/react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { buttonSizeStyles, Size } from '~/common/style/styles'

export type ResizableButtonOrLinkProps = {
  to?: LinkProps['to']
  size?: Size
  layoutMode?: 'inline' | 'fullWidth'
  customStyle?: FlattenSimpleInterpolation
  children: ReactNode
} & (Omit<LinkProps, 'to'> | ButtonHTMLAttributes<HTMLButtonElement>)

function ResizableButtonOrLink({
  to,
  size,
  layoutMode,
  customStyle,
  children,
  ...rest
}: ResizableButtonOrLinkProps) {
  //
  return typeof to == null ? (
    <StyledButton
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      size={size}
      layoutMode={layoutMode}
      customStyle={customStyle}
    >
      {children}
    </StyledButton>
  ) : (
    <StyledLink
      {...(rest as Omit<LinkProps, 'to'>)}
      to={to as string}
      size={size}
      layoutMode={layoutMode}
      customStyle={customStyle}
    >
      {children}
    </StyledLink>
  )
}
export default ResizableButtonOrLink

// Inner Components

const sharedButtonStyles = css<Omit<ResizableButtonOrLinkProps, 'to'>>`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  ${Font.style()
    .size('16px')
    .weight(600)
    .textDecoration('none')
    .whiteSpace('nowrap')
    .create()};
  border-radius: 6px;
  transition: all 0.25s ease-in-out;

  & span {
    padding-right: 6px;
  }
  &:disabled {
    ${Filters.filter().brightness(70).create()};
  }
  ${({ layoutMode: mode }) =>
    mode === 'fullWidth' &&
    css`
      width: 100%;
    `}
  ${({ size }) => size && buttonSizeStyles[size]};
  ${({ customStyle }) => customStyle && customStyle};
`

const StyledButton = styled.button`
  ${sharedButtonStyles};
`

const StyledLink = styled(Link)`
  ${sharedButtonStyles};
`

// styles constant
