import React, { ReactNode } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalFullHeight = createGlobalStyle`
  html, body {
    height: 100vh;
  }
`

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

// Sub Comps

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
