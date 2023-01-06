import { CSSProperties } from 'react'
// react 를 사용하지 않는 경우
// import { Property } from 'csstype'

export class Flex {
  static Container = class FlexContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inline = false) {
      return new Flex.Container(`;display:${inline ? 'inline-flex' : 'flex'};`)
    }

    // Item이 나열되는 방향
    direction(v: CSSProperties['flexDirection']) {
      this.props = `${this.props};flex-direction:${v};`
      return this
    }

    // 행 시작 위치
    alignContent(v: CSSProperties['alignContent']) {
      this.props = `${this.props};align-content:${v};`
      return this
    }

    // 행 끝 위치
    alignItems(v: CSSProperties['alignItems']) {
      this.props = `${this.props};align-items:${v};`
      return this
    }

    // 열 시작 위치
    justifyContent(v: CSSProperties['justifyContent']) {
      this.props = `${this.props};justify-content:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }
  }

  static Item = class FlexContainerBuilder {
    private constructor(private props: string | null) {}

    static style() {
      return new Flex.Item('')
    }

    // Flex Item 의 증가너비 비율
    grow(v: CSSProperties['flexGrow']) {
      this.props = `${this.props};flex-grow:${v};`
      return this
    }

    // Flex Item 의 증가감소 비율
    shrink(v: CSSProperties['flexShrink']) {
      this.props = `${this.props};flex-shrink:${v};`
      return this
    }

    // 공간 배분 전에 기본너비 설정
    basis(v: CSSProperties['flexBasis']) {
      this.props = `${this.props};flex-basis:${v};`
      return this
    }

    // cross-axis 에서 Item 의 정렬설정
    alignSelf(v: CSSProperties['alignSelf']) {
      this.props = `${this.props};align-self:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }

    /* presets */

    static flex1: `;flex: 1;`
  }
}

export class Grid {
  static Container = class GridContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inline = false) {
      return new Grid.Container(`;display:${inline ? 'inline-grid' : 'grid'};`)
    }

    // 명시적 가로 길이(number, "number + units", "repeat(number + units)"
    templateRows(v: CSSProperties['gridTemplateRows']) {
      this.props = `${this.props};grid-template-rows:${v};`
      return this
    }

    // 명시적 세로 길이(number, "number + units", "repeat(number + units)"
    templateColumns(v: CSSProperties['gridTemplateColumns']) {
      this.props = `${this.props};grid-template-columns:${v};`
      return this
    }

    // 암시적 가로 자동 Item 갯수(number, "number + units", "repeat(number + units)"
    autoRows(v: CSSProperties['gridAutoRows']) {
      this.props = `${this.props};grid-auto-rows:${v};`
      return this
    }

    // 암시적 세로 자동 Item 갯수(number, "number + units", "repeat(number + units)"
    autoColumns(v: CSSProperties['gridAutoColumns']) {
      this.props = `${this.props};grid-auto-columns:${v};`
      return this
    }

    // 자동배치 알고리즘 종류설정
    autoFlow(v: CSSProperties['gridAutoFlow']) {
      this.props = `${this.props};grid-auto-flow:${v};`
      return this
    }

    // 행 시작 위치
    alignContent(v: CSSProperties['alignContent']) {
      this.props = `${this.props};align-content:${v};`
      return this
    }

    // 행 끝 위치
    alignItems(v: CSSProperties['alignItems']) {
      this.props = `${this.props};align-items:${v};`
      return this
    }

    // 열 시작 위치
    justifyContent(v: CSSProperties['justifyContent']) {
      this.props = `${this.props};justify-content:${v};`
      return this
    }

    // 열 끝 위치
    justifyItems(v: CSSProperties['justifyItems']) {
      this.props = `${this.props};justify-items:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }
  }

  static Item = class GridContainerBuilder {
    private constructor(private props: string | null) {}

    static style() {
      return new Grid.Item('')
    }

    // Grid 의 수직 열,축 정렬
    alignSelf(v: CSSProperties['alignSelf']) {
      this.props = `${this.props};align-self:${v};`
      return this
    }

    // 모든 Grid Item 수직 열,축 정렬
    justifySelf(v: CSSProperties['justifySelf']) {
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

  size(v: CSSProperties['fontSize']) {
    this.props = `${this.props};font-size:${v};`
    return this
  }

  weight(v: CSSProperties['fontWeight']) {
    this.props = `${this.props};font-weight:${v};`
    return this
  }

  color(v: CSSProperties['color']) {
    this.props = `${this.props};color:${v};`
    return this
  }

  lineHeight(v: CSSProperties['lineHeight']) {
    this.props = `${this.props};line-height:${v};`
    return this
  }

  letterSpacing(v: CSSProperties['letterSpacing']) {
    this.props = `${this.props};letter-spacing:${v};`
    return this
  }

  create() {
    const result = this.props
    this.props = null
    return result
  }
}
