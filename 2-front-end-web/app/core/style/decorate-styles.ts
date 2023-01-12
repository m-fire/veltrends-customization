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
      border: 5px solid ${globalColors.grey1};
      z-index: -1;
    }
    &.active {
      &::before {
        border: 3px solid ${appColors.primary1};
        background-color: ${appColors.primary6};
      }
    }
  `,
} as const

export type PseudoThemeType = keyof typeof decorateStyles
