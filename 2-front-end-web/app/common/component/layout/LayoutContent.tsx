import { ReactNode } from 'react'
import styled from 'styled-components'
import { flexContainer } from '~/common/style/styled'

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
`
