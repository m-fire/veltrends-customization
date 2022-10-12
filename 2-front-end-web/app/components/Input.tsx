import React, { forwardRef, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, ...props }, ref) => {
    return (
      <>
        <StyledInput {...props} ref={ref} />{' '}
        {errorMessage ? <Message>{errorMessage}</Message> : null}
      </>
    )
  },
)
Input.displayName = 'Input'
export default Input

// Inner Components

const StyledInput = styled.input<Pick<InputProps, 'errorMessage'>>`
  height: 48px;
  border: 2px solid ${colors.grey2};
  border-radius: 6px;
  outline: none;
  font-size: 16px;
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
  ${({ errorMessage }) =>
    errorMessage &&
    css`
      border: 2px solid ${colors.secondary4};
    `}
`

const Message = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${colors.secondary1};
`
