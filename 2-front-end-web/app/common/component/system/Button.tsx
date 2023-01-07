import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/core/style/colors'
import { Filters, Flex, Font } from '~/common/style/css-builder'

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
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  ${Font.style().size('16px').weight(600).create()};
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
    ${Filters.filter().brightness(70).create()};
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
    ${Font.style().weight(800).color(colors.grey5).create()};
    background: none;
  `,
} as const

// types

type VariantType = 'primary' | 'secondary' | 'nobg'
