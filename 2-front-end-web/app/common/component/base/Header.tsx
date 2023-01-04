import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { LogoVeltrend } from '~/core/component/generate/svg'
import { flexContainer, fontStyles } from '~/common/style/styled'

type HeaderProps = {
  title?: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  className?: string
}

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
  ${flexContainer({ alignItems: 'center', justifyContent: 'center' })};
  position: relative;
  height: 56px;
  //border-bottom: 1px solid ${colors.grey1};
`

const HeaderSide = styled.div<{ position: 'left' | 'right' }>`
  ${flexContainer({ alignItems: 'center' })};
  position: absolute;
  ${(props) => props.position}: 16px;
  top: 0;
  height: 100%;
`

const HeaderTitle = styled.div`
  ${fontStyles({ size: '20px', weight: 800, color: colors.grey5 })};

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
