import React, { FocusEventHandler, forwardRef, useState } from 'react'
import Input, { InputProps } from '~/core/component/element/Input'
import { appColors } from '~/core/style/app-colors'
import InteractiveLabelInput from '~/common/component/element/InteractiveLabelInput'

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
    <InteractiveLabelInput
      activeColor={appColors.primary1}
      errorColor={appColors.secondary1}
      {...params}
      ref={ref}
    />
  ),
)

export default LabelInput

// Inner Components
