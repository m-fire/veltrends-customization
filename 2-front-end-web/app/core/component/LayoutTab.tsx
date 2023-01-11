import React, { ReactNode } from 'react'
import FullHeightBlock from '~/common/component/element/FullHeightBlock'
import HeaderMobile from '~/core/component/home/HeaderMobile'
import FooterMobile from '~/core/component/home/FooterMobile'
import LayoutContentBlock from '~/common/component/element/LayoutContentBlock'
import styled from 'styled-components'
import HeaderDesktop from '~/core/component/home/HeaderDesktop'
import { Filters } from '~/common/style/css-builder'

type TabLayoutProps = {
  header?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * Shows content with a header adn a tab bar.
 */
function LayoutTab({ header, children, className }: TabLayoutProps) {
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
      <FooterMobile />
    </FullHeightBlock>
  )
}
export default LayoutTab

// Inner Components

const Headers = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  ${Filters.backdrop().grayscale(50).blur(8).create()};
`

const StyledLayoutContent = styled(LayoutContentBlock)`
  padding-left: 20px;
  padding-right: 20px;
`
