import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'

type ButtonProps = {
  layoutMode?: 'inline' | 'fullWith'
}

function Button({
  layoutMode = 'inline',
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <StyledButton layoutMode={layoutMode} {...rest} />
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
  transition: filter 0.25s ease-in-out;

  &:disabled {
    filter: brightness(70%);
  }
  ${(props) =>
    props.layoutMode === 'fullWith' &&
    css`
      width: 100%;
    `}
`
