import React, { ReactNode } from 'react'
import FullHeightBlock from '~/common/component/element/FullHeightBlock'
import HeaderMobile from '~/core/component/home/HeaderMobile'
import FooterMobile from '~/core/component/home/FooterMobile'
import LayoutContentBlock from '~/common/component/element/LayoutContentBlock'
import styled from 'styled-components'
import HeaderDesktop from '~/core/component/home/HeaderDesktop'
import { Filters, Flex } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'
import { globalColors } from '~/common/style/global-colors'

type TabLayoutProps = {
  header?: ReactNode
  tabNavigator?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * Shows content with a header adn a tab bar.
 */
function TabLayout({
  header,
  tabNavigator,
  children,
  className,
}: TabLayoutProps) {
  return (
    <FullHeightBlock>
      {header ?? (
        <Headers>
          <HeaderMobile />
          <HeaderDesktop />
          {tabNavigator}
        </Headers>
      )}

      <StyledLayoutContent className={className}>
        {children}
      </StyledLayoutContent>
      <FooterMobile />
    </FullHeightBlock>
  )
}
export default TabLayout

// Inner Components

const Headers = styled.div`
  ${Flex.container().direction('column').alignItems('center').create()};
  position: absolute;
  left: 0;
  right: 0;
  height: 96px;
  ${Media.minWidth.desktop} {
    ${Flex.container().direction('row').justifyContent('center').create()};
    position: relative;
    height: 64px;
  }
  border-bottom: 1px solid ${globalColors.grey1};
  ${Filters.backdrop().grayscale(80).brightness(150).blur(16).create()};
`

const StyledLayoutContent = styled(LayoutContentBlock)`
  /* 마진은 overflow 영역이 가려진다. 따라서 패딩으로 컨탠츠 위치를 조절해야 함 */
  //margin-top: 96px;
  padding-top: 126px;
  ${Media.minWidth.desktop} {
    padding-top: 30px;
  }
  padding-left: 30px;
  padding-right: 30px;
`
