import { css, CSSProperties } from 'styled-components'

export function flexContainer({
  display = 'flex',
  direction,
  alignContent,
  alignItems,
  justifyContent,
}: FlexContainerParams = {}) {
  return css`
    display: ${display};

    ${direction &&
    css`
      flex-direction: ${direction};
    `}
    ${alignContent &&
    css`
      align-content: ${alignContent};
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

type FlexContainerParams = {
  display?: CSSProperties['display']
  direction?: CSSProperties['flexDirection']
  justifyContent?: CSSProperties['justifyContent']
  alignContent?: CSSProperties['alignContent']
  alignItems?: CSSProperties['alignItems']
}

export function flexItem({
  grow,
  shrink,
  basis,
  alignSelf,
}: FlexItemParams = {}) {
  return css`
    ${grow &&
    css`
      flex-grow: ${grow};
    `}
    ${shrink &&
    css`
      flex-shrink: ${shrink};
    `}
    ${basis &&
    css`
      flex-basis: ${basis};
    `}
    ${alignSelf &&
    css`
      align-self: ${alignSelf};
    `}
  `
}

type FlexItemParams = {
  // Flex Item 의 증가너비 비율
  grow?: CSSProperties['flexGrow']
  // Flex Item 의 증가감소 비율
  shrink?: CSSProperties['flexShrink']
  // 공간 배분 전에 기본너비 설정
  basis?: CSSProperties['flexBasis']
  // cross-axis 에서 Item 의 정렬설정
  alignSelf?: CSSProperties['alignSelf']
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
