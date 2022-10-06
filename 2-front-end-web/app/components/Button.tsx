import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
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

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.primary1};
  border: none;
  color: white;
  height: 48px;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: 600;
  border-radius: 6px;
  ${({ backgroundColor }) =>
    backgroundColor &&
    css`
      background: ${colors[backgroundColor]};
    `}
  ${(props) =>
    props.layoutMode === 'fullWith' &&
    css`
      width: 100%;
    `}
`
