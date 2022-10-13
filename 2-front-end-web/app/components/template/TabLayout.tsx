import React, { ReactNode } from 'react'
import FullHeightPage from '~/components/system/FullHeightPage'
import Header from '~/components/base/Header'
import Footer from '~/components/base/Footer'
import styled from 'styled-components'

type TabLayoutProps = {
  children?: ReactNode
}

/**
 * Shows content with a header adn a tab bar.
 */
function TabLayout({ children }: TabLayoutProps) {
  return (
    <FullHeightPage>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </FullHeightPage>
  )
}
export default TabLayout

// Inner Components

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
