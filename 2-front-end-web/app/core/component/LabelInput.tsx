import React, { FocusEventHandler, forwardRef } from 'react'
import { InputProps } from '~/common/component/atom/Input'
import { appColors } from '~/core/style/app-colors'
import InteractiveLabelInput, {
  InteractiveLabelInputProps,
} from '~/common/component/element/InteractiveLabelInput'
import styled from 'styled-components'

interface LabelInputProps extends InputProps {
  label: string
  errorMessage?: string | null
  activeColor?: string
  errorColor?: string
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  defaultValue?: InputProps['defaultValue']
}

const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
  (params, ref) => (
    <StyledLabelInput
      activeColor={appColors.primary1}
      errorColor={appColors.secondary1}
      {...params}
      ref={ref}
    />
  ),
)

export default LabelInput

// Inner Components

const StyledLabelInput = styled(InteractiveLabelInput)<
  Pick<InteractiveLabelInputProps, 'activeColor'>
>`
  &:focus {
    border: 2px solid
      ${({ activeColor }) => (activeColor ? activeColor : appColors.primary1)};
  }
\`
`
