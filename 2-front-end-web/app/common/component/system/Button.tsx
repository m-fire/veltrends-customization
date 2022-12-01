import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'
import { flexStyles, fontStyles } from '~/common/style/styled'

type ButtonProps = {
  layoutMode?: 'inline' | 'fullWidth'
  variant?: VariantType
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
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })};
  ${fontStyles({ size: '16px', weight: 600 })};
  height: 48px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 6px;
  //background: ${colors.primary1};
  //color: white;
  ${({ variant }) => variantStyles[variant!]}
  // todo: descructive
  transition: filter 0.25s ease-in-out;
  white-space: nowrap;

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

const variantStyles: Record<VariantType, ReturnType<typeof css>> = {
  primary: css`
    background: ${colors.primary1};
    color: white;
  `,
  secondary: css`
    background: ${colors.secondary1};
    color: white;
  `,
  nobg: css`
    ${fontStyles({ weight: 800, color: colors.grey5 })};
    background: none;
  `,
} as const

// types

type VariantType = 'primary' | 'secondary' | 'nobg'
