import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { Media, screenBreakpointMap } from '~/common/style/media-query'
import { Filters, Flex } from '~/common/style/css-builder'
import { LogoVeltrend, Search } from '~/core/component/generate/svg'
import VariantLinkButton from '~/core/component/VariantLinkButton'
import SearchArea from '~/common/component/element/SearchArea'
import { Link } from '@remix-run/react'

type HeaderDesktopProps = {
  logo?: ReactNode
  // headerLeft?: ReactNode
  // headerRight?: ReactNode
  // className?: string
}

//Todo: 데스크탑/모바일 각각의 해더를 디바이스 스크린사이즈에 따라 형태변경 구현
function HeaderDesktop({
  // headerLeft,
  // headerRight,
  // className,
  logo = <StyledLogoVeltrend />, // 기본 해더 타이틀: 메인로고
}: HeaderDesktopProps) {
  return (
    <Block>
      <HomeLink to="/">{logo}</HomeLink>
      <Content>
        <AddOn>AddOn: Left</AddOn>
        <AddOn>
          <SearchArea searchIcon={<Search />} />
          <VariantLinkButton to="/auth/login" variant="wire" size="small">
            로그인
          </VariantLinkButton>
          <VariantLinkButton to="/auth/register" size="small">
            회원가입
          </VariantLinkButton>
        </AddOn>
      </Content>
    </Block>
  )
}

export default HeaderDesktop

// Inner components

const Block = styled.div`
  display: none;
  ${Media.minWidth.desktop} {
    ${Flex.Container.style().alignItems('center').create()};
    padding-left: 20px;
    padding-right: 20px;
  }
  ${Media.minWidth.wide} {
    max-width: ${screenBreakpointMap.wide}px;
  }
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  height: 64px; // 56px;
  border-bottom: 1px solid ${globalColors.grey1};
`

const HomeLink = styled(Link)`
  display: block;
`

const StyledLogoVeltrend = styled(LogoVeltrend)`
  color: ${appColors.primary1};
  display: block;
  height: 32px;
  width: auto;
  margin-top: -10px;
  ${Filters.filter()
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 8, globalColors.grey1)
    .create()};
`

const Content = styled.div`
  ${Flex.Item.presets.flex1};
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('space-between')
    .create()};
  gap: 16px;
`

const AddOn = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  gap: 8px;
`
