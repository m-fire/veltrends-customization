import React, { forwardRef, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { Font } from '~/common/style/css-builder'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string | number | readonly string[]
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ defaultValue, ...props }, ref) => {
    return (
      <>
        <StyledInput defaultValue={defaultValue} {...props} />
      </>
    )
  },
)
export default Input

// Inner Components

const StyledInput = styled.input<InputProps>`
  ${Font.style().size('16px').create()};
  height: 48px;
  border: 2px solid ${globalColors.grey2};
  border-radius: 6px;
  outline: none;
  padding-left: 16px;
  padding-right: 16px;
  transition: all 0.25s ease-in-out;
  &::placeholder {
    color: ${globalColors.grey2};
  }
  &:disabled {
    background: ${globalColors.grey1};
    color: ${globalColors.grey3};
  }
`
