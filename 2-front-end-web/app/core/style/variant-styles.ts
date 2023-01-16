import { css } from 'styled-components'
import { appColors } from '~/core/style/app-colors'
import { desktopHover } from '~/common/style/styles'
import { Font } from '~/common/style/css-builder'

export const variantButtonStyles = {
  primary: css`
    background: ${appColors.primary1};
    color: white;
    ${desktopHover(css`
      background-color: ${appColors.primary3};
    `)};
  `,
  secondary: css`
    background: ${appColors.secondary1};
    color: white;
    ${desktopHover(css`
      background-color: ${appColors.secondary3};
    `)};
  `,
  textonly: css`
    ${Font.style().weight(800).color(appColors.primary1).create()};
    background: transparent;
    ${desktopHover(css`
      color: ${appColors.primary3};
    `)};
  `,
  wire: css`
    ${Font.style().weight(800).color(appColors.primary1).create()};
    border: 2px solid ${appColors.primary1};
    background: transparent;
    ${desktopHover(css`
      color: white;
      border-color: ${appColors.primary3};
      background-color: ${appColors.primary3};
    `)};
  `,
} as const
export type VariantButtonType = keyof typeof variantButtonStyles
