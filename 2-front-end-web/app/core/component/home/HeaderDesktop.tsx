import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { Media, screenBreakpointMap } from '~/common/style/media-query'
import { Filters, Flex } from '~/common/style/css-builder'
import { LogoVeltrend, Search } from '~/core/component/generate/svg'
import VariantLinkOrButton from '~/core/component/VariantLinkOrButton'
import SearchArea from '~/common/component/element/SearchArea'
import { Link } from '@remix-run/react'
import UserMenuButton from '~/core/component/home/UserMenuButton'
import { useUserStoreAction, useUserState } from '~/common/store/user'

type HeaderDesktopProps = {
  logo?: ReactNode
  headerLeft?: ReactNode
  // headerRight?: ReactNode
  // className?: string
}

//Todo: 데스크탑/모바일 각각의 해더를 디바이스 스크린사이즈에 따라 형태변경 구현
function HeaderDesktop({
  headerLeft,
  // headerRight,
  // className,
  logo = <StyledLogoVeltrend />, // 기본 해더 타이틀: 메인로고
}: HeaderDesktopProps) {
  const { user } = useUserState()

  return (
    <Block>
      <HomeLink to="/">{logo}</HomeLink>
      <Container>
        <ItemLeft>{headerLeft}</ItemLeft>
        <ItemRight>
          <SearchArea searchIcon={<Search />} />

          {user ? (
            <>
              <WriteOutterButton to="/write" variant="wire" size="small">
                새 글 작성
              </WriteOutterButton>
              <UserMenuButton username={user.username} />
            </>
          ) : (
            <>
              <VariantLinkOrButton to="/auth/login" variant="wire" size="small">
                로그인
              </VariantLinkOrButton>
              <VariantLinkOrButton to="/auth/register" size="small">
                회원가입
              </VariantLinkOrButton>
            </>
          )}
        </ItemRight>
      </Container>
    </Block>
  )
}

export default HeaderDesktop

// Inner components

const Block = styled.header`
  display: none;
  ${Media.minWidth.tablet} {
    ${Flex.container().alignItems('center').create()};
    padding-left: 30px;
    padding-right: 30px;
  }
  max-width: ${screenBreakpointMap.desktop}px;
  width: 100%;
  height: 64px; // 56px;
  border-bottom: 1px solid ${globalColors.grey1};
`

const HomeLink = styled(Link)`
  display: block;
  margin-right: 32px;
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

const Container = styled.div`
  ${Flex.item().flex(1).create()};
  ${Flex.container()
    .alignItems('center')
    .justifyContent('space-between')
    .create()};
  gap: 16px;
`

const ItemLeft = styled.div`
  ${Flex.container().alignItems('center').create()};
  gap: 12px;
`

const ItemRight = styled.div`
  ${Flex.container().alignItems('center').create()};
  gap: 12px;
`

const WriteOutterButton = styled(VariantLinkOrButton)`
  ${Media.maxWidth.desktop} {
    display: none;
  }
`
