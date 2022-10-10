import React, { InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
}

function Input({ errorMessage, ...props }: InputProps) {
  return (
    <>
      <StyledInput {...props} />{' '}
      {errorMessage && <Message>{errorMessage}</Message>}
    </>
  )
}
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

const Message = styled.div<Pick<InputProps, 'errorMessage'>>`
  margin-top: 6px;
  font-size: 12px;
  color: ${colors.secondary1};
`
