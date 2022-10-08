import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

function Input(props: InputProps) {
  return (
    <>
      <StyledInput {...props} />
    </>
  )
}
export default Input

// Inner Components

const StyledInput = styled.input`
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
`
