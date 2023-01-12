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
  $layoutMode = 'inline',
  variant = 'primary',
  $customStyle,
  children,
  ...rest
}: VariantLinkButtonProps) {
  return (
    <StyledResizableButtonOrLink
      {...rest}
      to={to}
      size={size}
      $layoutMode={$layoutMode}
      variant={variant}
      $customStyle={$customStyle}
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
