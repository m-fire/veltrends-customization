import React, { ReactNode } from 'react'
import FullHeightPage from '~/components/system/FullHeightPage'
import Header from '~/components/base/Header'
import Footer from '~/components/base/Footer'
import styled from 'styled-components'

type TabTemplateProps = {
  children?: ReactNode
}

function TabTemplate({ children }: TabTemplateProps) {
  return (
    <FullHeightPage>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </FullHeightPage>
  )
}
export default TabTemplate

// Inner Components

const Content = styled.div<Pick<TabTemplateProps, 'children'>>`
  flex: 1;
`
