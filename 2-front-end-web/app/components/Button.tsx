import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

type ButtonProps = {
  layoutMode?: 'inline' | 'fullWith'
  backgroundColor?: keyof typeof colors
}

function Button({
  layoutMode = 'inline',
  backgroundColor = 'primary1',
  ...rest
}: ButtonProps & HTMLAttributes<HTMLButtonElement>) {
  return (
    <StyledButton
      layoutMode={layoutMode}
      backgroundColor={backgroundColor}
      {...rest}
    />
  )
}
export default Button

// Inner Components

const StyledButton = styled.button<ButtonProps>``
