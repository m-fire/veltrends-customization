import React, { ButtonHTMLAttributes, ReactNode, SVGProps } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'
import { flexStyles } from '~/common/style/styled'

type ButtonProps = {
  layoutMode?: 'inline' | 'fullWidth'
  variant?: 'primary' | 'secondary' | 'nobg'
  [key: string]: any
}

function Button({
  layoutMode = 'inline',
  variant = 'primary',
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <StyledButton layoutMode={layoutMode} variant={variant} {...rest} />
}
export default Button

// Inner Components

const StyledButton = styled.button<ButtonProps>`
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })}
  height: 48px;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: 600;
  border-radius: 6px;
  //background: ${colors.primary1};
  //color: white;
  ${({ variant }) => variantStyles[variant!]}
  transition: filter 0.25s ease-in-out;
  white-space: nowrap;
  font-family: Pretendard;

  & span {
    padding-right: 6px;
  }
  &:disabled {
    filter: brightness(70%);
  }
  ${({ layoutMode: lm }) =>
    lm === 'fullWidth' &&
    css`
      width: 100%;
    `}
`

const variantStyles = {
  primary: css`
    background: ${colors.primary1};
    color: white;
  `,
  secondary: css`
    background: ${colors.secondary1};
    color: white;
  `,
  nobg: css`
    background: none;
    color: ${colors.grey5};
    font-weight: 800;
  `,
}
