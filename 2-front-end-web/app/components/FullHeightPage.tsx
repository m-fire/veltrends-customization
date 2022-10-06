import React, { ReactNode } from 'react'
import styled from 'styled-components'

type FullHeightPageProps = {
  children: ReactNode
}

function FullHeightPage({ children }: FullHeightPageProps) {
  return (
    <>
      <Page>{children}</Page>
    </>
  )
}
export default FullHeightPage

// Sub Comps

const Page = styled.div`
  height: 100%;
`
