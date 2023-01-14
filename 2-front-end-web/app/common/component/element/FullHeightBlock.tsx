import React, { ReactNode } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Flex } from '~/common/style/css-builder'

type FullHeightBlockProps = {
  children: ReactNode
}

function FullHeightBlock({ children }: FullHeightBlockProps) {
  return (
    <>
      <Page>{children}</Page>
      <GlobalFullHeight />
    </>
  )
}
export default FullHeightBlock

const GlobalFullHeight = createGlobalStyle`
  html, body {
    height: 100vh;
  }
`

// Inner components

const Page = styled.div`
  ${Flex.container().direction('column').create()};
  height: 100%;
`
