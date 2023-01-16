import React, { forwardRef } from 'react'
import styled from 'styled-components'
import {
  variantButtonStyles,
  VariantButtonType,
} from '~/core/style/variant-styles'
import ResizableLinkOrButton, {
  ResizableLinkOrButtonProps,
  ResizableLinkOrButtonRef,
} from '~/common/component/atom/ResizableLinkOrButton'

type VariantLinkOrButtonProps = {
  variant?: VariantButtonType
} & ResizableLinkOrButtonProps

const VariantLinkOrButton = forwardRef<
  ResizableLinkOrButtonRef,
  VariantLinkOrButtonProps
>(
  (
    {
      to,
      size = 'medium',
      layout = 'inline',
      variant = 'primary',
      customstyles,
      children,
      ...rest
    },
    ref,
  ) => (
    <StyledResizableButtonOrLink
      {...rest}
      to={to}
      size={size}
      layout={layout}
      variant={variant}
      customstyles={customstyles}
      ref={ref}
    >
      {children}
    </StyledResizableButtonOrLink>
  ),
)
export default VariantLinkOrButton

// Inner Components

const StyledResizableButtonOrLink = styled(
  ResizableLinkOrButton,
)<VariantLinkOrButtonProps>`
  ${({ variant }) => variant && variantButtonStyles[variant]};
`
