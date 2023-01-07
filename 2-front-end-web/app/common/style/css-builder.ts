import { CSSProperties } from 'react'
import { AngleUnit, Unit, unit as u } from '~/common/style/unit'
// react 미사용 시 'csstype' lib 설치 후 사용
// import { Property } from 'csstype'

type CSSProps = CSSProperties
// type CSSProps = Property // csstype

export class Flex {
  static readonly Container = class FlexContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inline = false) {
      return new Flex.Container(`;display:${inline ? 'inline-flex' : 'flex'};`)
    }

    // Item이 나열되는 방향
    direction(v: CSSProps['flexDirection']) {
      this.props = `${this.props};flex-direction:${v};`
      return this
    }

    // 행 시작 위치
    alignContent(v: CSSProps['alignContent']) {
      this.props = `${this.props};align-content:${v};`
      return this
    }

    // 행 끝 위치
    alignItems(v: CSSProps['alignItems']) {
      this.props = `${this.props};align-items:${v};`
      return this
    }

    // 열 시작 위치
    justifyContent(v: CSSProps['justifyContent']) {
      this.props = `${this.props};justify-content:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }
  }

  static readonly Item = class FlexContainerBuilder {
    private constructor(private props: string | null) {}

    static style() {
      return new Flex.Item('')
    }

    // Flex Item 의 증가너비 비율
    grow(v: CSSProps['flexGrow']) {
      this.props = `${this.props};flex-grow:${v};`
      return this
    }

    // Flex Item 의 증가감소 비율
    shrink(v: CSSProps['flexShrink']) {
      this.props = `${this.props};flex-shrink:${v};`
      return this
    }

    // 공간 배분 전에 기본너비 설정
    basis(v: CSSProps['flexBasis']) {
      this.props = `${this.props};flex-basis:${v};`
      return this
    }

    // cross-axis 에서 Item 의 정렬설정
    alignSelf(v: CSSProps['alignSelf']) {
      this.props = `${this.props};align-self:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }

    /* presets */

    // grow:1, shrink:1, basis:0%
    static readonly flex1 = `;flex: 1;`
  }
}

export class Grid {
  static readonly Container = class GridContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inline = false) {
      return new Grid.Container(`;display:${inline ? 'inline-grid' : 'grid'};`)
    }

    // 명시적 가로 길이(number, "number + units", "repeat(number + units)"
    templateRows(v: CSSProps['gridTemplateRows']) {
      this.props = `${this.props};grid-template-rows:${v};`
      return this
    }

    // 명시적 세로 길이(number, "number + units", "repeat(number + units)"
    templateColumns(v: CSSProps['gridTemplateColumns']) {
      this.props = `${this.props};grid-template-columns:${v};`
      return this
    }

    // 암시적 가로 자동 Item 갯수(number, "number + units", "repeat(number + units)"
    autoRows(v: CSSProps['gridAutoRows']) {
      this.props = `${this.props};grid-auto-rows:${v};`
      return this
    }

    // 암시적 세로 자동 Item 갯수(number, "number + units", "repeat(number + units)"
    autoColumns(v: CSSProps['gridAutoColumns']) {
      this.props = `${this.props};grid-auto-columns:${v};`
      return this
    }

    // 자동배치 알고리즘 종류설정
    autoFlow(v: CSSProps['gridAutoFlow']) {
      this.props = `${this.props};grid-auto-flow:${v};`
      return this
    }

    // 행 시작 위치
    alignContent(v: CSSProps['alignContent']) {
      this.props = `${this.props};align-content:${v};`
      return this
    }

    // 행 끝 위치
    alignItems(v: CSSProps['alignItems']) {
      this.props = `${this.props};align-items:${v};`
      return this
    }

    // 열 시작 위치
    justifyContent(v: CSSProps['justifyContent']) {
      this.props = `${this.props};justify-content:${v};`
      return this
    }

    // 열 끝 위치
    justifyItems(v: CSSProps['justifyItems']) {
      this.props = `${this.props};justify-items:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }
  }

  static readonly Item = class GridContainerBuilder {
    private constructor(private props: string | null) {}

    static style() {
      return new Grid.Item('')
    }

    // Grid 의 수직 열,축 정렬
    alignSelf(v: CSSProps['alignSelf']) {
      this.props = `${this.props};align-self:${v};`
      return this
    }

    // 모든 Grid Item 수직 열,축 정렬
    justifySelf(v: CSSProps['justifySelf']) {
      this.props = `${this.props};justify-self:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }
  }
}

export class Font {
  private constructor(private props: string | null) {}

  static style() {
    return new Font('')
  }

  size(v: CSSProps['fontSize']) {
    this.props = `${this.props};font-size:${v};`
    return this
  }

  weight(v: CSSProps['fontWeight']) {
    this.props = `${this.props};font-weight:${v};`
    return this
  }

  color(v: CSSProps['color']) {
    this.props = `${this.props};color:${v};`
    return this
  }

  lineHeight(v: CSSProps['lineHeight']) {
    this.props = `${this.props};line-height:${v};`
    return this
  }

  letterSpacing(v: CSSProps['letterSpacing']) {
    this.props = `${this.props};letter-spacing:${v};`
    return this
  }

  create() {
    const result = this.props
    this.props = null
    return result
  }
}

export class Filters {
  private constructor(
    private props: string | null,
    private includeWebkit: boolean,
  ) {}

  static filter(includeWebkit = true) {
    return new Filters('filter:', includeWebkit)
  }
  static backdrop(includeWebkit = true) {
    return new Filters('backdrop-filter:', includeWebkit)
  }

  //SVG 필터 (en-US)를 가리키는 URI를 받습니다. 외부 XML 파일에 포함된 필터도 가능합니다.
  //- filter: url(resources.svg#c1)
  url(s: string) {
    this.props = `${this.props} url(${s})`
    return this
  }

  //blur( <length>? )
  //- filter: blur(5px)
  blur(px: string | number, unit: Unit = u.px) {
    this.props = `${this.props} blur(${typeof px == 'string' ? px : px + unit})`
    return this
  }

  //brightness( [ <number> | <percentage> ]? )
  //- filter: contrast(200%)
  brightness(perc: number) {
    this.props = `${this.props} brightness(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  //contrast( [ <number> | <percentage> ]? )
  //- filter: contrast(200%)
  contrast(perc: string | number) {
    this.props = `${this.props} contrast(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  //drop-shadow( [ <color>? && <length>{2,3} ] )
  //- filter: drop-shadow(16px 16px 10px black)
  dropShadow(
    xPx: string | number,
    yPx: string | number,
    lenPx: string | number,
    color: CSSProps['color'],
    unit: Unit = u.px,
  ) {
    this.props = `${this.props} drop-shadow(
      ${typeof xPx == 'string' ? xPx : xPx + unit}
      ${typeof yPx == 'string' ? yPx : yPx + unit}
      ${typeof lenPx == 'string' ? lenPx : lenPx + unit}
      ${color})`
    return this
  }

  //grayscale( [ <number> | <percentage> ]? )
  //- filter: grayscale(100%)
  grayscale(perc: string | number) {
    this.props = `${this.props} grayscale(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  //hue-rotate( [ <angle> | <zero> ]? )
  //- filter: hue-rotate(90deg)
  hueRotate(angle: string | number, unit: AngleUnit = u.deg) {
    this.props = `${this.props} hue-rotate(${
      typeof angle == 'string' ? angle : angle + unit
    })`
    return this
  }

  //invert( [ <number> | <percentage> ]? )
  //- filter: invert(100%)
  invert(perc: string | number) {
    this.props = `${this.props} invert(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  //opacity( [ <number> | <percentage> ]? )
  //- filter: opacity(50%)
  opacity(perc: string | number) {
    this.props = `${this.props} opacity(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  //sepia( [ <number> | <percentage> ]? )
  //- filter: sepia(100%)
  sepia(perc: string | number) {
    this.props = `${this.props} sepia(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  //saturate( [ <number> | <percentage> ]? )
  //- filter: saturate(200%)
  saturate(perc: string | number) {
    this.props = `${this.props} saturate(${
      typeof perc == 'string' ? perc : perc + '%'
    })`
    return this
  }

  create() {
    const result = this.includeWebkit
      ? `;${this.props};-webkit-${this.props};`
      : `;${this.props};`
    this.props = null
    return result
  }
}
