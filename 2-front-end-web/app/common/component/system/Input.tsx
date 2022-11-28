import React, { forwardRef, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { fontStyles } from '~/common/style/styled'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string | null
  defaultValue?: string | number | readonly string[]
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, defaultValue, ...props }, ref) => {
    return (
      <>
        <StyledInput defaultValue={defaultValue} {...props} />
        {errorMessage ? <Message>{errorMessage}</Message> : null}
      </>
    )
  },
)
Input.displayName = 'Input'
export default Input

// Inner Components

const StyledInput = styled.input<Pick<InputProps, 'errorMessage'>>`
  ${fontStyles({ size: '16px' })};
  height: 48px;
  border: 2px solid ${colors.grey2};
  border-radius: 6px;
  outline: none;
  padding-left: 16px;
  padding-right: 16px;
  transition: all 0.25s ease-in-out;

  &:focus {
    border: 2px solid ${colors.primary1};
  }
  &::placeholder {
    color: ${colors.grey2};
  }
  &:disabled {
    background: ${colors.grey1};
    color: ${colors.grey3};
  }
`

const Message = styled.div`
  ${fontStyles({ size: '14px', color: colors.secondary1 })};
  margin-top: 6px;
`
