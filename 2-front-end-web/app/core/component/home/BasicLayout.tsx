import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { useGoBack } from '~/common/hook/useGoBack'
import HeaderMobile from '~/core/component/home/HeaderMobile'
import { Filters, Flex } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'
import MobileBackButton from '~/core/component/home/MobileBackButton'
import HeaderDesktop from '~/core/component/home/HeaderDesktop'
import FullHeightBlock from '~/common/component/element/FullHeightBlock'
import LayoutContentBlock from '~/common/component/element/LayoutContentBlock'
import { globalColors } from '~/common/style/global-colors'
import { useListModeURLParams } from '~/core/hook/request/useListModeURLParams'

import ListModeSelector from '~/core/component/home/ListModeSelector'
type BasicLayoutProps = {
  title?: ReactNode
  onGoBack?: () => void
  headerRight?: ReactNode
  hasBackButton?: boolean
  mobileHeaderSize?: HeaderSize
  desktopHeaderVisible?: boolean
  className?: string
  children?: ReactNode
}
type HeaderSize = 'small' | 'large'

/**
 * Shows content with a header.
 * Header might contain back button.
 * Header might contain title.
 */
function BasicLayout({
  title,
  onGoBack,
  headerRight,
  hasBackButton,
  mobileHeaderSize = 'small',
  desktopHeaderVisible,
  className,
  children,
}: BasicLayoutProps) {
  const { mode, dateRange } = useListModeURLParams('trending')
  const goBack = useGoBack()

  return (
    <FullHeightBlock>
      <HeaderContainer headerSize={mobileHeaderSize}>
        <HeaderMobile
          title={title}
          headerLeft={
            hasBackButton ? (
              <MobileBackButton onClick={onGoBack ?? goBack} />
            ) : null
          }
          headerRight={headerRight}
        />

        {desktopHeaderVisible ? (
          <HeaderDesktop
            headerLeft={
              <ListModeSelectorDesktop
                currentMode={mode}
                dateRange={dateRange}
              />
            }
          />
        ) : null}
      </HeaderContainer>

      <LayoutContent className={className}>{children}</LayoutContent>
    </FullHeightBlock>
  )
}
export default BasicLayout

export const HeaderContainer = styled.div<{ headerSize: HeaderSize }>`
  ${Flex.container().direction('column').alignItems('center').create()};
  position: absolute;
  left: 0;
  right: 0;
  height: 64px;
  border-bottom: 1px solid ${globalColors.grey1};
  padding-left: 30px;
  padding-right: 30px;
  ${Filters.backdrop().grayscale(80).brightness(150).blur(16).create()};
  ${({ headerSize }) =>
    headerSize === 'large'
      ? css`
          height: 96px;
        `
      : null}
  ${Media.minWidth.desktop} {
    ${Flex.container().direction('row').justifyContent('center').create()};
    position: relative;
    height: 64px;
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
  padding-top: 56px;
  padding-left: 30px;
  padding-right: 30px;
  ${Media.minWidth.desktop} {
    padding-top: 30px;
  }
`
