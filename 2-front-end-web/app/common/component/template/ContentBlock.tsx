import { ReactNode } from 'react'
import styled from 'styled-components'
import { screen } from '~/common/style/media-query'
import { Flex } from '~/common/style/css-builder'

type LayoutContentProps = {
  className?: string
  children?: ReactNode
}

function ContentBlock({ className, children }: LayoutContentProps) {
  return <Container className={className}>{children}</Container>
}
export default ContentBlock

// Inner Components

const Container = styled.div`
  ${Flex.Item.flex1};
  ${Flex.Container.style().direction('column').create()};
  padding-top: 56px;
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
