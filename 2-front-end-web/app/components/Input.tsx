import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

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

const StyledInput = styled.input``
