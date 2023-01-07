import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/core/style/colors'
import { Filters, Flex, Font } from '~/common/style/css-builder'

type ButtonProps = {
  size?: Size
  layoutMode?: 'inline' | 'fullWidth'
  variant?: VariantType
  [key: string]: any
}
type VariantType = 'primary' | 'secondary' | 'textonly' | 'wire'
type Size = 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'

function Button({
  size = 'medium',
  layoutMode = 'inline',
  variant = 'primary',
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <StyledButton
      layoutMode={layoutMode}
      variant={variant}
      size={size}
      {...rest}
    />
  )
}
export default Button

// Inner Components

const StyledButton = styled.button<Required<ButtonProps>>`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  ${Font.style().size('16px').weight(600).create()};
  ${({ variant }) => variantStyles[variant]};
  ${({ size }) => sizeStyles[size]};
  height: 48px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 6px;
  transition: filter 0.25s ease-in-out;
  white-space: nowrap;

  & span {
    padding-right: 6px;
  }
  &:disabled {
    ${Filters.filter().brightness(70).create()};
  }
  ${({ layoutMode: mode }) =>
    mode === 'fullWidth' &&
    css`
      width: 100%;
    `}
`

// types

// styles constant

const variantStyles: CSSRecord<VariantType> = {
  primary: css`
    background: ${colors.primary1};
    color: white;
  `,
  secondary: css`
    background: ${colors.secondary1};
    color: white;
  `,
  textonly: css`
    ${Font.style().weight(800).color(colors.grey5).create()};
    background: transparent;
  `,
  wire: css`
    ${Font.style().weight(800).color(colors.primary1).create()};
    border: 2px solid ${colors.primary1};
    background: transparent;
  `,
} as const

const sizeStyles: CSSRecord<Size> = {
  xxs: css`
    height: 12px;
    font-size: 10px;
    padding-left: 8px;
    padding-right: 8px;
  `,
  xs: css`
    height: 24px;
    font-size: 12px;
    padding-left: 10px;
    padding-right: 10px;
  `,
  small: css`
    height: 36px;
    font-size: 14px;
    padding-left: 12px;
    padding-right: 12px;
  `,
  medium: css`
    height: 48px;
    font-size: 16px;
    padding-left: 14px;
    padding-right: 14px;
  `,
  large: css`
    height: 52px;
    font-size: 18px;
    padding-left: 16px;
    padding-right: 16px;
  `,
  xl: css`
    height: 64px;
    font-size: 20px;
    padding-left: 18px;
    padding-right: 18px;
  `,
  xxl: css`
    height: 72px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
  `,
}

// types

type CSSRecord<K extends string> = Record<K, ReturnType<typeof css>>
