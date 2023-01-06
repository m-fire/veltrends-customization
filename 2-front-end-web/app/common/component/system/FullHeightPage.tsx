import React, { ReactNode } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Flex } from '~/common/style/css-builder'

type FullHeightPageProps = {
  children: ReactNode
}

function FullHeightPage({ children }: FullHeightPageProps) {
  return (
    <>
      <Page>{children}</Page>
      <GlobalFullHeight />
    </>
  )
}
export default FullHeightPage

const GlobalFullHeight = createGlobalStyle`
  html, body {
    height: 100vh;
  }
`

// Inner components

const Page = styled.div`
  ${Flex.Container.style().direction('column').create()};
  height: 100%;
`
