import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/core/style/colors'
import { LogoVeltrend } from '~/core/component/generate/svg'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { screen } from '~/common/style/media-query'

type HeaderMobileProps = {
  title?: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  className?: string
}

//Todo: 데스크탑/모바일 각각의 해더를 디바이스 스크린사이즈에 따라 형태변경 구현
function HeaderMobile({
  title = <StyledLogoVeltrend />, // 기본 해더 타이틀: 메인로고
  headerLeft,
  headerRight,
  className,
}: HeaderMobileProps) {
  return (
    <Block className={className}>
      {headerLeft ? (
        <HeaderSide position={'left'}>{headerLeft}</HeaderSide>
      ) : null}
      <HeaderTitle className="title">{title}</HeaderTitle>
      {headerRight ? (
        <HeaderSide position={'right'}>{headerRight}</HeaderSide>
      ) : null}
    </Block>
  )
}

export default HeaderMobile

// Sub Comps

const Block = styled.header`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  ${screen.min_w.desktop} {
    display: none;
  }
  position: relative;
  height: 56px;
  //border-bottom: 1px solid ${colors.grey1};
`
const StyledLogoVeltrend = styled(LogoVeltrend)`
  color: ${colors.primary1};
  display: block;
  height: 32px;
  width: auto;
  margin-top: -10px;
  ${Filters.filter()
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 8, colors.grey1)
    .create()};
`

const HeaderSide = styled.div<{ position: 'left' | 'right' }>`
  ${Flex.Container.style().alignItems('center').create()};
  position: absolute;
  ${(props) => props.position}: 16px;
  top: 0;
  height: 100%;
`

const HeaderTitle = styled.div`
  ${Font.style().size('20px').weight(800).color(colors.grey5).create()};
  svg {
    display: block;
    width: 130px;
    height: 30px;
  }
`
