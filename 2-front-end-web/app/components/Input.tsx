import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

export interface InputProps extends HTMLAttributes<HTMLInputElement> {}

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
  border: 1px solid ${colors.grey2};
  border-radius: 6px;
  outline: none;
  font-size: 16px;
  padding-left: 16px;
  padding-right: 16px;
`
