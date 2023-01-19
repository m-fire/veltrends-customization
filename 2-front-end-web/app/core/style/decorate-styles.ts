import { css } from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'

export const decorateStyles = {
  circleStroke: css`
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 4px solid rgba(252, 252, 252, 0.3);
    }
  `,
} as const

export type PseudoThemeType = keyof typeof decorateStyles
