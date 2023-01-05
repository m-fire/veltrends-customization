import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { LogoVeltrend } from '~/core/component/generate/svg'
import Flex from '~/common/style/css-flex'
import Font from '~/common/style/css-font'

type HeaderProps = {
  title?: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  className?: string
}

//Todo: 데스크탑/모바일 각각의 해더를 디바이스 스크린사이즈에 따라 형태변경 구현
function Header({
  title = <LogoVeltrend />, // 기본 해더 타이틀: 메인로고
  headerLeft,
  headerRight,
  className,
}: HeaderProps) {
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

export default Header

// Sub Comps

const Block = styled.header`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  position: relative;
  height: 56px;
  //border-bottom: 1px solid ${colors.grey1};
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
  -webkit-filter: drop-shadow(0px 0px 0.8px white)
    drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 8px white);
  filter: drop-shadow(0px 0px 0.8px white) drop-shadow(0px 0px 1px white)
    drop-shadow(0px 0px 8px white);
`
