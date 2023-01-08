import React, { ReactNode } from 'react'
import FullHeightBlock from '~/common/component/atom/FullHeightBlock'
import HeaderMobile from '~/common/component/element/HeaderMobile'
import Footer from '~/common/component/template/Footer'
import ContentBlock from '~/common/component/template/ContentBlock'
import styled from 'styled-components'
import HeaderDesktop from '~/common/component/element/HeaderDesktop'
import { Filters } from '~/common/style/css-builder'

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
    <FullHeightBlock>
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
    </FullHeightBlock>
  )
}
export default TabLayout

// Inner Components

const Headers = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  ${Filters.backdrop().grayscale(50).blur(8).create()};
`

const StyledLayoutContent = styled(ContentBlock)`
  padding-left: 20px;
  padding-right: 20px;
`
