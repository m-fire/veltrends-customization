import { CSSProperties } from 'react'
// react 를 사용하지 않는 경우
// import { Property } from 'csstype'

export class Flex {
  static Container = class FlexContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inline = false) {
      return new Flex.Container(`;display:${inline ? 'inline-flex' : 'flex'};`)
    }

    direction(v: CSSProperties['flexDirection']) {
      this.props = `${this.props};flex-direction:${v};`
      return this
    }

    alignContent(v: CSSProperties['alignContent']) {
      this.props = `${this.props};align-content:${v};`
      return this
    }

    alignItems(v: CSSProperties['alignItems']) {
      this.props = `${this.props};align-items:${v};`
      return this
    }

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

    grow(v: CSSProperties['flexGrow']) {
      this.props = `${this.props};flex-grow:${v};`
      return this
    }

    shrink(v: CSSProperties['flexShrink']) {
      this.props = `${this.props};flex-shrink:${v};`
      return this
    }

    basis(v: CSSProperties['flexBasis']) {
      this.props = `${this.props};flex-basis:${v};`
      return this
    }

    alignSelf(v: CSSProperties['alignSelf']) {
      this.props = `${this.props};align-self:${v};`
      return this
    }

    create() {
      const result = this.props
      this.props = null
      return result
    }
  }
}

export class Grid {
  static Container = class GridContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inline = false) {
      return new Grid.Container(`;display:${inline ? 'inline-grid' : 'grid'};`)
    }

    templateRows(v: CSSProperties['gridTemplateRows']) {
      this.props = `${this.props};grid-template-rows:${v};`
      return this
    }

    templateColumns(v: CSSProperties['gridTemplateColumns']) {
      this.props = `${this.props};grid-template-columns:${v};`
      return this
    }

    autoRows(v: CSSProperties['gridAutoRows']) {
      this.props = `${this.props};grid-auto-rows:${v};`
      return this
    }

    autoColumns(v: CSSProperties['gridAutoColumns']) {
      this.props = `${this.props};grid-auto-columns:${v};`
      return this
    }

    autoFlow(v: CSSProperties['gridAutoFlow']) {
      this.props = `${this.props};grid-auto-flow:${v};`
      return this
    }

    alignContent(v: CSSProperties['alignContent']) {
      this.props = `${this.props};align-content:${v};`
      return this
    }

    alignItems(v: CSSProperties['alignItems']) {
      this.props = `${this.props};align-items:${v};`
      return this
    }

    justifyContent(v: CSSProperties['justifyContent']) {
      this.props = `${this.props};justify-content:${v};`
      return this
    }

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

    alignSelf(v: CSSProperties['alignSelf']) {
      this.props = `${this.props};align-self:${v};`
      return this
    }

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
