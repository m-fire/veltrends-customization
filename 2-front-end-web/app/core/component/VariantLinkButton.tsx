import React from 'react'
import styled from 'styled-components'
import { variantStyles, VariantType } from '~/core/style/variant-styles'
import ResizableLinkButton, {
  ResizableLinkButtonProps,
} from '~/common/component/atom/ResizableLinkButton'

type VariantLinkButtonProps = {
  variant?: VariantType
} & ResizableLinkButtonProps

function VariantLinkButton({
  to,
  size = 'medium',
  layout = 'inline',
  variant = 'primary',
  customstyles,
  children,
  ...rest
}: VariantLinkButtonProps) {
  return (
    <StyledResizableButtonOrLink
      {...rest}
      to={to}
      size={size}
      layout={layout}
      variant={variant}
      customstyles={customstyles}
    >
      {children}
    </StyledResizableButtonOrLink>
  )
}
export default VariantLinkButton

// Inner Components

const StyledResizableButtonOrLink = styled(
  ResizableLinkButton,
)<VariantLinkButtonProps>`
  ${({ variant }) => variant && variantStyles[variant]};
`
