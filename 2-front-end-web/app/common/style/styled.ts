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

export function gridContiner({
  display = 'grid',
  templateRows,
  templateColumns,
  autoRows,
  autoColumns,
  autoFlow,
  alignContent,
  alignItems,
  justifyContent,
  justifyItems,
}: GridContinerParams = {}) {
  return css`
    display: ${display};

    ${templateRows &&
    css`
      grid-template-rows: ${templateRows};
    `}
    ${templateColumns &&
    css`
      grid-template-columns: ${templateColumns};
    `}
    ${autoRows &&
    css`
      grid-auto-rows: ${autoRows};
    `}
    ${autoColumns &&
    css`
      grid-auto-columns: ${autoColumns};
    `}
    ${autoFlow &&
    css`
      grid-auto-flow: ${autoFlow};
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
    ${justifyItems &&
    css`
      justify-items: ${justifyItems};
    `}
  `
}

type GridContinerParams = {
  display?: 'grid' | 'inline-grid'

  // 명시적 가로 길이(number + units/ repeat(number + units)
  templateRows?: CSSProperties['gridTemplateRows']
  templateColumns?: CSSProperties['gridTemplateColumns']
  // 암시적 가로 Item 갯수(number + units/ repeat(number + units)
  autoRows?: CSSProperties['gridAutoRows']
  autoColumns?: CSSProperties['gridAutoColumns']
  // 자동배치 알고리즘 종류설정
  autoFlow?: CSSProperties['gridAutoFlow']

  // 행 시작 위치
  rowStart?: CSSProperties['gridRowStart']
  // 행 끝 위치
  rowEnd?: CSSProperties['gridRowEnd']
  // 열 시작 위치
  columnStart?: CSSProperties['gridColumnStart']
  // 열 끝 위치
  columnEnd?: CSSProperties['gridColumnEnd']

  // Grid 의 수직 열,축 정렬
  alignContent?: CSSProperties['alignContent']
  // 모든 Grid Item 수직 열,축 정렬
  alignItems?: CSSProperties['alignItems']
  // Grid 의 수평 열,축 정렬
  justifyContent?: CSSProperties['justifyContent']
  // 모든 Grid Item 수평 열,축 정렬
  justifyItems?: CSSProperties['justifyItems']
}

export function gridItem({
  alignSelf,
  justifySelf,
}: GridItemStylesParams = {}) {
  return css`
    ${alignSelf &&
    css`
      align-self: ${alignSelf};
    `}
    ${justifySelf &&
    css`
      justify-self: ${justifySelf};
    `}
  `
}

type GridItemStylesParams = {
  // Grid 의 수직 열,축 정렬
  alignSelf?: CSSProperties['alignSelf']
  // 모든 Grid Item 수직 열,축 정렬
  justifySelf?: CSSProperties['justifySelf']
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
