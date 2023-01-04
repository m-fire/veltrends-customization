import { CSSProperties } from 'react'

class Font {
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
export default Font
