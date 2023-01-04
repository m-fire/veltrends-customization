import { CSSProperties } from 'react'

class Grid {
  static Container = class GridContainerBuilder {
    private constructor(private props: string | null) {}

    static style(inlineGrid = false) {
      return new Grid.Container(
        `;display:${inlineGrid ? 'inline-grid' : 'grid'};`,
      )
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

export default Grid
