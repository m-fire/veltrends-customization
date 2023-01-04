import { CSSProperties } from 'react'

class Flex {
  static Container = class FlexContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inlineFlex = false) {
      return new Flex.Container(
        `;display:${inlineFlex ? 'inline-flex' : 'flex'};`,
      )
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

export default Flex
