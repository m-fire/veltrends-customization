import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {}

function Button({ ...rest }: ButtonProps) {
  return <StyledButton {...rest} />
}
export default Button

// Inner Components

const StyledButton = styled.button``
