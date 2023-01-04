import React, { ReactNode } from 'react'
import FullHeightPage from '~/common/component/system/FullHeightPage'
import Header from '~/common/component/base/Header'
import Footer from '~/common/component/base/Footer'
import styled from 'styled-components'
import { flexContainer } from '~/common/style/styled'

type TabLayoutProps = {
  header?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * Shows content with a header adn a tab bar.
 */
function TabLayout({ header, children, className }: TabLayoutProps) {
  return (
    <FullHeightPage>
      {header ? header : <Header />}
      <Content className={className}>{children}</Content>
      <Footer />
    </FullHeightPage>
  )
}
export default TabLayout

// Inner Components

const Content = styled.section`
  ${flexContainer({ direction: 'column' })};
  // grow:1, shrink:1, basis:0%
  flex: 1;
  overflow: scroll;
  padding-left: 20px;
  padding-right: 20px;
`
