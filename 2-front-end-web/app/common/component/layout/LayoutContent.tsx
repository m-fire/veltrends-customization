import { ReactNode } from 'react'
import styled from 'styled-components'
import { screen } from '~/common/style/media-query'
import { Flex } from '~/common/style/css-builder'

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
  ${Flex.Container.style().direction('column').create()};
  padding-top: 56px;

  flex: 1; // grow:1, shrink:1, basis:0%
  overflow: scroll;
  ${screen.min_w.tablet} {
    padding-left: 30px;
    padding-right: 30px;
  }
  ${screen.min_w.wide} {
    width: 1280px; // wide screen minWidth
    margin-left: auto;
    margin-right: auto;
  }
`
