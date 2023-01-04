import { ReactNode } from 'react'
import styled from 'styled-components'
import { flexContainer } from '~/common/style/styled'
import { screenMediaQueryMap } from '~/common/style/media-query'

type LayoutContentProps = {
  className?: string
  children?: ReactNode
}

function LayoutContent({ className, children }: LayoutContentProps) {
  return <Container className={className}>{children}</Container>
}
export default LayoutContent

// Inner Components

const Container = styled.div`
  ${flexContainer({ direction: 'column' })};
  // grow:1, shrink:1, basis:0%
  flex: 1;
  overflow: scroll;
  padding-left: 30px;
  padding-right: 30px;
  ${screenMediaQueryMap.tablet} {
    padding-left: 40px;
    padding-right: 40px;
  }
  ${screenMediaQueryMap.wide} {
    width: 1280px; // wide screen minWidth
    margin-left: auto;
    margin-right: auto;
  }
`
