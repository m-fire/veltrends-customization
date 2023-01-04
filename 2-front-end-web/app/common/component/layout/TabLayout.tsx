import React, { ReactNode } from 'react'
import FullHeightPage from '~/common/component/system/FullHeightPage'
import Header from '~/common/component/base/Header'
import Footer from '~/common/component/base/Footer'
import LayoutContent from '~/common/component/layout/LayoutContent'

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
      {header ? header : <Header />}
      <LayoutContent className={className}>{children}</LayoutContent>
      <Footer />
    </FullHeightPage>
  )
}
export default TabLayout

// Inner Components
