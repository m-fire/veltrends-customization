import React, {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  RefObject,
} from 'react'
import { Link, LinkProps } from '@remix-run/react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { buttonSizeStyles, Size } from '~/common/style/styles'

export type ResizableLinkOrButtonProps = {
  to?: LinkProps['to']
  size?: Size
  layout?: 'inline' | 'fullWidth'
  customstyles?: FlattenSimpleInterpolation
  disabled?: boolean
  children: ReactNode
} & (
  | AnchorHTMLAttributes<HTMLAnchorElement>
  | ButtonHTMLAttributes<HTMLButtonElement>
)
export type ResizableLinkOrButtonRef = HTMLAnchorElement | HTMLButtonElement

const ResizableLinkOrButton = forwardRef<
  ResizableLinkOrButtonRef,
  ResizableLinkOrButtonProps
>(({ to, size, layout, customstyles, children, disabled, ...rest }, ref) => {
  //
  return to == null ? (
    <StyledButton
      size={size}
      layout={layout}
      customstyles={customstyles}
      disabled={disabled}
      ref={ref as RefObject<HTMLButtonElement>}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </StyledButton>
  ) : (
    <StyledLink
      to={to as string}
      size={size}
      layout={layout}
      customstyles={customstyles}
      disabled={disabled}
      ref={ref as RefObject<HTMLAnchorElement>}
      {...(rest as Omit<LinkProps, 'to'>)}
    >
      {children}
    </StyledLink>
  )
})
export default ResizableLinkOrButton

// Inner Components

const sharedButtonStyles = css<Omit<ResizableLinkOrButtonProps, 'to'>>`
  ${Flex.container().alignItems('center').justifyContent('center').create()};
  ${Font.style()
    .size(16)
    .weight(600)
    .textDecoration('none')
    .whiteSpace('nowrap')
    .create()};
  border-radius: 6px;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
  &:disabled {
    ${Filters.filter().brightness(70).create()};
    pointer-events: none;
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
