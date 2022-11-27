import { css, CSSProperties } from 'styled-components'

export function fontStyles({
  size,
  weight,
  color,
  lineHeight,
  letterSpacing,
}: FontStylesParams) {
  return css`
    ${size &&
    css`
      font-size: ${size};
    `}
    ${weight &&
    css`
      font-weight: ${weight};
    `}
    ${color &&
    css`
      color: ${color};
    `}
    ${lineHeight &&
    css`
      line-height: ${lineHeight};
    `}
    ${letterSpacing &&
    css`
      letter-spacing: ${letterSpacing};
    `}
  `
}

type FontStylesParams = {
  size?: CSSProperties['fontSize'] | null
  weight?: CSSProperties['fontWeight'] | null
  color?: CSSProperties['color'] | null
  lineHeight?: CSSProperties['lineHeight'] | null
  letterSpacing?: CSSProperties['letterSpacing'] | null
}

export function displayFlex<OptKey extends keyof CSSProperties>({
  direction,
  alignItems,
  justifyContent,
}: FlexStylesParams = {}) {
  return css`
    display: flex;

    ${direction &&
    css`
      flex-direction: ${direction};
    `}
    ${alignItems &&
    css`
      align-items: ${alignItems};
    `}
    ${justifyContent &&
    css`
      justify-content: ${justifyContent};
    `}
  `
}

type FlexStylesParams = {
  direction?: CSSProperties['flexDirection'] | null
  alignItems?: CSSProperties['alignItems'] | null
  justifyContent?: CSSProperties['justifyContent'] | null
}
