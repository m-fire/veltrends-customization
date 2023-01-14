import { CSSProperties } from 'react'
import { AngleUnit, Unit, unit as u } from '~/common/style/unit'
// react 미사용 시 'csstype' lib 설치 후 사용
// import { Property } from 'csstype'

// type CSSProps = Property // csstype
type CSSProps = CSSProperties

// Flex props builder
export const Flex = (() => {
  const emptyString = ''
  let css: string = emptyString

  // build method
  const create = () => {
    const result = css
    css = emptyString
    return result
  }

  const containerMethods = {
    // Item이 나열되는 방향
    direction(v: CSSProps['flexDirection']) {
      css = `${css};flex-direction:${v};`
      return this
    },

    // 행 시작 위치
    alignContent(v: CSSProps['alignContent']) {
      css = `${css};align-content:${v};`
      return this
    },

    // 행 끝 위치
    alignItems(v: CSSProps['alignItems']) {
      css = `${css};align-items:${v};`
      return this
    },

    // 열 시작 위치
    justifyContent(v: CSSProps['justifyContent']) {
      css = `${css};justify-content:${v};`
      return this
    },

    create,
  }

  const itemMethods = {
    // Flex Item 의 증가너비 비율
    grow(v: CSSProps['flexGrow']) {
      css = `${css};flex-grow:${v};`
      return this
    },

    // Flex Item 의 증가감소 비율
    shrink(v: CSSProps['flexShrink']) {
      css = `${css};flex-shrink:${v};`
      return this
    },

    // 공간 배분 전에 기본너비 설정
    basis(v: CSSProps['flexBasis']) {
      css = `${css};flex-basis:${v};`
      return this
    },

    // cross-axis 에서 Item 의 정렬설정
    alignSelf(v: CSSProps['alignSelf']) {
      css = `${css};align-self:${v};`
      return this
    },

    // flex-grow: 1; flex-shrink: 1; flex-basis: 0;
    flex(v: CSSProps['flex']) {
      css = `${css};flex:${v};`
      return this
    },

    create,
  }

  return {
    container(inline = false) {
      css = `;display:${inline ? 'inline-flex' : 'flex'};`
      return containerMethods
    },
    item() {
      css = emptyString
      return itemMethods
    },
  }
})()

// Grid props builder
export const Grid = (() => {
  const emptyString = ''
  let css: string = emptyString

  // build method
  const create = () => {
    const result = css
    css = emptyString
    return result
  }

  const containers = {
    // 명시적 가로 길이(number, "number + units", "repeat(number + units)"
    templateRows(v: CSSProps['gridTemplateRows']) {
      css = `${css}grid-template-rows:${v};`
      return this
    },

    // 명시적 세로 길이(number, "number + units", "repeat(number + units)"
    templateColumns(v: CSSProps['gridTemplateColumns']) {
      css = `${css}grid-template-columns:${v};`
      return this
    },

    // 암시적 가로 자동 Item 갯수(number, "number + units", "repeat(number + units)"
    autoRows(v: CSSProps['gridAutoRows']) {
      css = `${css}grid-auto-rows:${v};`
      return this
    },

    // 암시적 세로 자동 Item 갯수(number, "number + units", "repeat(number + units)"
    autoColumns(v: CSSProps['gridAutoColumns']) {
      css = `${css}grid-auto-columns:${v};`
      return this
    },

    // 자동배치 알고리즘 종류설정
    autoFlow(v: CSSProps['gridAutoFlow']) {
      css = `${css}grid-auto-flow:${v};`
      return this
    },

    // 행 시작 위치
    alignContent(v: CSSProps['alignContent']) {
      css = `${css}align-content:${v};`
      return this
    },

    // 행 끝 위치
    alignItems(v: CSSProps['alignItems']) {
      css = `${css}align-items:${v};`
      return this
    },

    // 열 시작 위치
    justifyContent(v: CSSProps['justifyContent']) {
      css = `${css}justify-content:${v};`
      return this
    },

    // 열 끝 위치
    justifyItems(v: CSSProps['justifyItems']) {
      css = `${css}justify-items:${v};`
      return this
    },
    create,
  }

  const items = {
    // Grid 의 수직 열,축 정렬
    alignSelf(v: CSSProps['alignSelf']) {
      css = `${css}align-self:${v};`
      return this
    },

    // 모든 Grid Item 수직 열,축 정렬
    justifySelf(v: CSSProps['justifySelf']) {
      css = `${css}justify-self:${v};`
      return this
    },
    create,
  }

  return {
    container(inline = false) {
      css = `;display:${inline ? 'inline-grid' : 'grid'};`
      return containers
    },
    item() {
      css = ';'
      return items
    },
  }
})()

// IIFE initialize
export const Font = (() => {
  // closure
  let css: string | null = null

  const methods = {
    size(v: CSSProps['fontSize'], unit: Unit = u.px) {
      css = `${css}font-size:${typeof v == 'string' ? v : v + unit};`
      return this
    },

    weight(v: CSSProps['fontWeight']) {
      css = `${css}font-weight:${v};`
      return this
    },

    color(v: CSSProps['color']) {
      css = `${css}color:${v};`
      return this
    },

    lineHeight(v: CSSProps['lineHeight']) {
      css = `${css}line-height:${v};`
      return this
    },

    textAlign(v: CSSProps['textAlign']) {
      css = `${css}text-align:${v};`
      return this
    },

    whiteSpace(v: CSSProps['whiteSpace']) {
      css = `${css}white-space:${v};`
      return this
    },

    textDecoration(v: CSSProps['textDecoration']) {
      css = `${css}text-decoration:${v};`
      return this
    },

    letterSpacing(v: CSSProps['letterSpacing']) {
      css = `${css}letter-spacing:${v};`
      return this
    },

    wordBreak(v: CSSProps['wordBreak']) {
      css = `${css}word-break:${v};`
      return this
    },
    create() {
      const result = css
      css = null
      return result
    },
  }

  return {
    style() {
      css = ';'
      return methods
    },
    presets: {
      noneTextDecoration: ';text-decoration: none;',
    } as const,
  }
})()

export const Filters = (() => {
  let css: string | null = null // closure
  let hasWebkit: boolean | null = null // closure

  const methods = {
    //SVG 필터 (en-US)를 가리키는 URI를 받습니다. 외부 XML 파일에 포함된 필터도 가능합니다.
    //- filter: url(resources.svg#c1)
    url(s: string) {
      css = `${css} url(${s})`
      return this
    },

    //blur( <length>? )
    //- filter: blur(5px)
    blur(px: string | number, unit: Unit = u.px) {
      css = `${css} blur(${typeof px == 'string' ? px : px + unit})`
      return this
    },

    //brightness( [ <number> | <percentage> ]? )
    //- filter: contrast(200%)
    brightness(perc: string | number) {
      css = `${css} brightness(${typeof perc === 'string' ? perc : perc + '%'})`
      return this
    },

    //contrast( [ <number> | <percentage> ]? )
    //- filter: contrast(200%)
    contrast(perc: string | number) {
      css = `${css} contrast(${typeof perc == 'string' ? perc : perc + '%'})`
      return this
    },

    //drop-shadow( [ <color>? && <length>{2,3} ] )
    //- filter: drop-shadow(16px 16px 10px black)
    dropShadow(
      xPx: string | number,
      yPx: string | number,
      lenPx: string | number,
      color: CSSProps['color'],
      unit: Unit = u.px,
    ) {
      css = `${css} drop-shadow(
      ${typeof xPx == 'string' ? xPx : xPx + unit}
      ${typeof yPx == 'string' ? yPx : yPx + unit}
      ${typeof lenPx == 'string' ? lenPx : lenPx + unit}
      ${color})`
      return this
    },

    //grayscale( [ <number> | <percentage> ]? )
    //- filter: grayscale(100%)
    grayscale(perc: string | number) {
      css = `${css} grayscale(${typeof perc == 'string' ? perc : perc + '%'})`
      return this
    },

    //hue-rotate( [ <angle> | <zero> ]? )
    //- filter: hue-rotate(90deg)
    hueRotate(angle: string | number, unit: AngleUnit = u.deg) {
      css = `${css} hue-rotate(${
        typeof angle == 'string' ? angle : angle + unit
      })`
      return this
    },

    //invert( [ <number> | <percentage> ]? )
    //- filter: invert(100%)
    invert(perc: string | number) {
      css = `${css} invert(${typeof perc == 'string' ? perc : perc + '%'})`
      return this
    },

    //opacity( [ <number> | <percentage> ]? )
    //- filter: opacity(50%)
    opacity(perc: string | number) {
      css = `${css} opacity(${typeof perc == 'string' ? perc : perc + '%'})`
      return this
    },

    //sepia( [ <number> | <percentage> ]? )
    //- filter: sepia(100%)
    sepia(perc: string | number) {
      css = `${css} sepia(${typeof perc == 'string' ? perc : perc + '%'})`
      return this
    },

    //saturate( [ <number> | <percentage> ]? )
    //- filter: saturate(200%)
    saturate(perc: string | number) {
      css = `${css} saturate(${typeof perc == 'string' ? perc : perc + '%'})`
      return this
    },

    create() {
      const result = hasWebkit ? `;${css};-webkit-${css};` : `;${css};`
      hasWebkit = css = null
      return result
    },
  }
  return {
    filter(hasWebkitFilter = true) {
      hasWebkit = hasWebkitFilter
      css = 'filter:'
      return methods
    },
    backdrop(hasWebkitFilter = true) {
      hasWebkit = hasWebkitFilter
      css = 'backdrop-filter:'
      return methods
    },
  }
})()
