import { css, CSSObject, FlattenSimpleInterpolation } from 'styled-components'

/**
 * 오직 Desktop 에서만 활성화 되고, enabled 상태의 element 에 적용되는
 * 미디어쿼리 hover 스타일
 * @param styles
 */
export const desktopHover = (
  styles: string | FlattenSimpleInterpolation,
) => css`
  @media (hover: hover) {
    &:hover:enabled {
      ${styles}
    }
  }
`
