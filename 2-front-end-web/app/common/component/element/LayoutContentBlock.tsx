import { ReactNode } from 'react'
import styled from 'styled-components'
import { Media, screenBreakpointMap } from '~/common/style/media-query'
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

const Container = styled.main`
  ${Flex.item().flex(1).create()};
  ${Flex.container().direction('column').create()};
  overflow-x: hidden;
  overflow-y: scroll;
  ${Media.minWidth.wide} {
    width: ${screenBreakpointMap.wide}px;
    margin-left: auto;
    margin-right: auto;
  }
`
