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

export function flexStyles<OptKey extends keyof CSSProperties>({
  display = 'flex',
  direction,
  alignItems,
  justifyContent,
}: FlexStylesParams = {}) {
  return css`
    display: ${display};

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
  display?: CSSProperties['display'] | null
  direction?: CSSProperties['flexDirection'] | null
  alignItems?: CSSProperties['alignItems'] | null
  justifyContent?: CSSProperties['justifyContent'] | null
}
