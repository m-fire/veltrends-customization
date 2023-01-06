import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/core/style/colors'
import { screen } from '~/common/style/media-query'
import { Flex } from '~/common/style/css-builder'
import { LogoVeltrend } from '~/core/component/generate/svg'

type HeaderDesktopProps = {
  title?: ReactNode
  // headerLeft?: ReactNode
  // headerRight?: ReactNode
  // className?: string
}

//Todo: 데스크탑/모바일 각각의 해더를 디바이스 스크린사이즈에 따라 형태변경 구현
function HeaderMobile({
  title = <StyledLogoVeltrend />, // 기본 해더 타이틀: 메인로고
}: // headerLeft,
// headerRight,
// className,
HeaderDesktopProps) {
  return <Block>{title}</Block>
}

export default HeaderMobile

// Inner components

const Block = styled.div`
  display: none;
  ${screen.min_w.desktop} {
    ${Flex.Container.style().alignItems('center').create()};
  }
  position: relative;
  height: 64px; // 56px;
  border-bottom: 1px solid ${colors.grey1};
`

const StyledLogoVeltrend = styled(LogoVeltrend)`
  display: block;
  height: 32px;
  width: auto;
  margin-top: -10px;
  -webkit-filter: drop-shadow(0px 0px 0.8px white)
    drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 8px white);
  filter: drop-shadow(0px 0px 0.8px white) drop-shadow(0px 0px 1px white)
    drop-shadow(0px 0px 8px white);
`