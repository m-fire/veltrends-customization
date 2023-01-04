import React, { ReactNode } from 'react'
import FullHeightPage from '~/common/component/system/FullHeightPage'
import Header from '~/common/component/base/Header'
import Footer from '~/common/component/base/Footer'
import LayoutContent from '~/common/component/layout/LayoutContent'
import styled from 'styled-components'

type TabLayoutProps = {
  header?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * Shows content with a header adn a tab bar.
 */
function TabLayout({ header, children, className }: TabLayoutProps) {
  return (
    <FullHeightPage>
      {header ? header : <StyledHeader />}
      <StyledLayoutContent className={className}>
        {children}
      </StyledLayoutContent>
      <Footer />
    </FullHeightPage>
  )
}
export default TabLayout

// Inner Components

const StyledHeader = styled(Header)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  backdrop-filter: blur(8px); // grayscale(80%)
  -webkit-backdrop-filter: blur(8px); // grayscale(80%)
`

const StyledLayoutContent = styled(LayoutContent)`
  padding-left: 20px;
  padding-right: 20px;
`
