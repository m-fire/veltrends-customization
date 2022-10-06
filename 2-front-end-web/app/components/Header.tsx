import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import SvgLogoVeltrend from '~/components/generate/LogoVeltrend'

type HeaderProps = {
  title?: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
}

function Header({
  title = <SvgLogoVeltrend />,
  headerLeft,
  headerRight,
}: HeaderProps) {
  return (
    <Block>
      <HeaderLeft>{headerLeft}</HeaderLeft>
      <Title>{title}</Title>
      <HeaderRight>{headerRight}</HeaderRight>
    </Block>
  )
}

export default Header

// Sub Comps

const HeaderLeft = styled.div`
  position: absolute;
  left: 16px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
`

const HeaderRight = styled.div`
  position: absolute;
  right: 16px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
`

const Block = styled.header`
  position: relative;
  height: 56px;
  border-bottom: 1px solid ${colors.grey1};
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Title = styled.div`
  color: ${colors.grey5};
  font-size: 18px;
  font-weight: 600;
  svg {
    width: 130px;
    height: 30px;
  }
`
