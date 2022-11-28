import { css, CSSProperties } from 'styled-components'

export function flexStyles<OptKey extends keyof CSSProperties>({
  display = 'flex',
  direction,
  alignItems,
  justifyContent,
  flex,
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
    ${flex &&
    css`
      flex: ${flex};
    `}
  `
}

type FlexStylesParams = {
  display?: CSSProperties['display']
  direction?: CSSProperties['flexDirection']
  alignItems?: CSSProperties['alignItems']
  justifyContent?: CSSProperties['justifyContent']
  flex?: CSSProperties['flex']
}

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
  size?: CSSProperties['fontSize']
  weight?: CSSProperties['fontWeight']
  color?: CSSProperties['color']
  lineHeight?: CSSProperties['lineHeight']
  letterSpacing?: CSSProperties['letterSpacing']
}
