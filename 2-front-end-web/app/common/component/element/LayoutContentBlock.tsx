import { ReactNode } from 'react'
import styled from 'styled-components'
import { Media } from '~/common/style/media-query'
import { Flex } from '~/common/style/css-builder'

type LayoutContentProps = {
  className?: string
  children?: ReactNode
}

function LayoutContentBlock({ className, children }: LayoutContentProps) {
  return <Container className={className}>{children}</Container>
}
export default LayoutContentBlock

// Inner Components

const Container = styled.div`
  ${Flex.Item.flex1};
  ${Flex.Container.style().direction('column').create()};
  padding-top: 56px;
  overflow: scroll;
  ${Media.minWidth.tablet} {
    padding-left: 30px;
    padding-right: 30px;
  }
  ${Media.minWidth.wide} {
    width: 1280px; // wide screen minWidth
    margin-left: auto;
    margin-right: auto;
  }
`
