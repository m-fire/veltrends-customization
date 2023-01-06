import React, { ReactNode } from 'react'
import FullHeightPage from '~/common/component/system/FullHeightPage'
import HeaderMobile from '~/common/component/base/HeaderMobile'
import Footer from '~/common/component/base/Footer'
import LayoutContent from '~/common/component/layout/LayoutContent'
import styled from 'styled-components'
import HeaderDesktop from '~/common/component/base/HeaderDesktop'

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
      {header ?? (
        <Headers>
          <HeaderMobile />
          <HeaderDesktop />
        </Headers>
      )}
      <StyledLayoutContent className={className}>
        {children}
      </StyledLayoutContent>
      <Footer />
    </FullHeightPage>
  )
}
export default TabLayout

// Inner Components

const Headers = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  backdrop-filter: grayscale(80%) blur(8px); // blur(8px)
  -webkit-backdrop-filter: grayscale(80%) blur(8px); // blur(8px)
`

const StyledLayoutContent = styled(LayoutContent)`
  padding-left: 20px;
  padding-right: 20px;
`
