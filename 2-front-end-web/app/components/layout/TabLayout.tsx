import React, { ReactNode } from 'react'
import FullHeightPage from '~/components/system/FullHeightPage'
import Header from '~/components/base/Header'
import Footer from '~/components/base/Footer'
import styled from 'styled-components'
import { flexStyles } from '~/common/style/styled'

type TabLayoutProps = {
  children?: ReactNode
  className?: string
}

/**
 * Shows content with a header adn a tab bar.
 */
function TabLayout({ children, className }: TabLayoutProps) {
  return (
    <FullHeightPage>
      <Header />
      <Content className={className}>{children}</Content>
      <Footer />
    </FullHeightPage>
  )
}
export default TabLayout

// Inner Components

const Content = styled.main`
  ${flexStyles({ direction: 'column', flex: 1 })};
  overflow: scroll;
  padding-left: 20px;
  padding-right: 20px;
`
