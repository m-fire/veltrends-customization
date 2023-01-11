import { css, FlattenSimpleInterpolation } from 'styled-components'

/**
 * 오직 Desktop 에서만 활성화 되고, enabled 상태의 element 에 적용되는
 * 미디어쿼리 hover 스타일
 * @param styles
 */
export const desktopHover = (
  styles: string | FlattenSimpleInterpolation,
) => css`
  @media (hover: hover) {
    //: hover 와 enabled 된 모든 element 대상
    //&:hover:enabled {

    //: hover 와 disabled 이 안된 모든 element 대상
    &:hover:not([disabled]) {
      ${styles}
    }
  }
`

export type Size = 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'

export const buttonSizeStyles: Record<Size, FlattenSimpleInterpolation> = {
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

export const imageSizeStyles: Record<Size, FlattenSimpleInterpolation> = {
  xxs: css`
    font-size: 8px;
    width: 10px;
    height: 10px;
  `,
  xs: css`
    font-size: 10px;
    width: 12px;
    height: 12px;
  `,
  small: css`
    font-size: 12px;
    width: 16px;
    height: 16px;
  `,
  medium: css`
    font-size: 14px;
    width: 20px;
    height: 20px;
  `,
  large: css`
    font-size: 16px;
    width: 24px;
    height: 24px;
  `,
  xl: css`
    font-size: 20px;
    width: 32px;
    height: 32px;
  `,
  xxl: css`
    font-size: 24px;
    width: 40px;
    height: 40px;
  `,
}
