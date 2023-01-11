import React from 'react'
import { LinkProps } from '@remix-run/react'
import styled from 'styled-components'
import { variantStyles, VariantType } from '~/core/style/variant-styles'
import ResizableButtonOrLink, {
  ResizableButtonOrLinkProps,
} from '~/common/component/atom/ResizableButtonOrLink'

type VariantButtonOrLinkProps = {
  variant?: VariantType
} & ResizableButtonOrLinkProps

function VariantButtonOrLink({
  to,
  size = 'medium',
  layoutMode = 'inline',
  variant = 'primary',
  customStyle,
  children,
  ...rest
}: VariantButtonOrLinkProps) {
  return (
    <StyledResizableButtonOrLink
      to={to}
      size={size}
      layoutMode={layoutMode}
      variant={variant}
      customStyle={customStyle}
      {...rest}
    >
      {children}
    </StyledResizableButtonOrLink>
  )
}
export default VariantButtonOrLink

// Inner Components

const StyledResizableButtonOrLink = styled(
  ResizableButtonOrLink,
)<VariantButtonOrLinkProps>`
  ${({ variant }) => variant && variantStyles[variant]};
`
