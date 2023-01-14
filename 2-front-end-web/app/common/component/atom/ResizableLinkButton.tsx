import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, LinkProps } from '@remix-run/react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { buttonSizeStyles, Size } from '~/common/style/styles'

export type ResizableLinkButtonProps = {
  to?: LinkProps['to']
  size?: Size
  layout?: 'inline' | 'fullWidth'
  customstyles?: FlattenSimpleInterpolation
  children: ReactNode
} & (Omit<LinkProps, 'to'> | ButtonHTMLAttributes<HTMLButtonElement>)

function ResizableLinkButton({
  to,
  size,
  layout,
  customstyles,
  children,
  ...rest
}: ResizableLinkButtonProps) {
  //
  return to == null ? (
    <StyledButton
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      size={size}
      layout={layout}
      customstyles={customstyles}
    >
      {children}
    </StyledButton>
  ) : (
    <StyledLink
      {...(rest as Omit<LinkProps, 'to'>)}
      to={to as string}
      size={size}
      layout={layout}
      customstyles={customstyles}
    >
      {children}
    </StyledLink>
  )
}
export default ResizableLinkButton

// Inner Components

const sharedButtonStyles = css<Omit<ResizableLinkButtonProps, 'to'>>`
  ${Flex.container().alignItems('center').justifyContent('center').create()};
  ${Font.style()
    .size(16)
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
  ${({ layout: mode }) =>
    mode === 'fullWidth' &&
    css`
      width: 100%;
    `}
  ${({ size }) => size && buttonSizeStyles[size]};
  ${({ customstyles }) => customstyles};
`

const StyledButton = styled.button`
  ${sharedButtonStyles};
`

const StyledLink = styled(Link)`
  ${sharedButtonStyles};
`

// styles constant
