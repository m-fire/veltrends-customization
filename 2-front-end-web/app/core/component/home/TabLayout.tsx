import React, { ReactNode } from 'react'
import FullHeightBlock from '~/common/component/element/FullHeightBlock'
import FooterMobile from '~/core/component/home/FooterMobile'
import LayoutContentBlock from '~/common/component/element/LayoutContentBlock'
import styled from 'styled-components'
import { Filters, Flex } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'
import { globalColors } from '~/common/style/global-colors'
import { useListModeURLParams } from '~/core/hook/request/useListModeURLParams'
import HeaderMobile from '~/core/component/home/HeaderMobile'
import HeaderDesktop from '~/core/component/home/HeaderDesktop'
import ListModeSelector from '~/core/component/home/ListModeSelector'

type TabLayoutProps = {
  header?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * Shows content with a header adn a tab bar.
 */
function TabLayout({ header, children, className }: TabLayoutProps) {
  const { mode, dateRange } = useListModeURLParams('trending')

  return (
    <FullHeightBlock>
      <HeaderContainer>
        {header ?? (
          <>
            <HeaderMobile />
            <ListModeSelectorMobile currentMode={mode} dateRange={dateRange} />

            <HeaderDesktop
              headerLeft={
                <ListModeSelectorDesktop
                  currentMode={mode}
                  dateRange={dateRange}
                />
              }
            />
          </>
        )}
      </HeaderContainer>

      <LayoutContent className={className}>{children}</LayoutContent>

      <FooterMobile />
    </FullHeightBlock>
  )
}
export default TabLayout

// Inner Components

const HeaderContainer = styled.div`
  ${Flex.container().direction('column').alignItems('center').create()};
  position: absolute;
  left: 0;
  right: 0;
  height: 96px;
  padding-left: 30px;
  padding-right: 30px;
  z-index: 1;
  ${Media.minWidth.tablet} {
    ${Flex.container().direction('row').justifyContent('center').create()};
    position: relative;
    height: 64px;
  }
  border-bottom: 1px solid ${globalColors.grey1};
  ${Filters.backdrop().grayscale(100).brightness(180).blur(16).create()};
`

const ListModeSelectorMobile = styled(ListModeSelector)`
  & > ul {
    gap: 24px;
  }
  ${Media.minWidth.tablet} {
    display: none;
  }
`
const ListModeSelectorDesktop = styled(ListModeSelector)`
  & > ul {
    gap: 16px;
  }
  ${Media.maxWidth.tablet} {
    display: none;
  }
`

const LayoutContent = styled(LayoutContentBlock)`
  ${Media.maxWidth.tablet} {
    padding-top: 96px;
  }
  padding-left: 30px;
  padding-right: 30px;
`
