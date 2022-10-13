import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { LogoVeltrend } from '~/components/generate/svg'

type HeaderProps = {
  title?: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
}

function Header({
  title = <LogoVeltrend />,
  headerLeft,
  headerRight,
}: HeaderProps) {
  return (
    <Block>
      {headerLeft && <HeaderSide position={'left'}>{headerLeft}</HeaderSide>}
      <Title>{title}</Title>
      {headerRight && <HeaderSide position={'right'}>{headerRight}</HeaderSide>}
    </Block>
  )
}

export default Header

// Sub Comps

const HeaderSide = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${(props) => props.position}: 16px;
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
    display: block;
    width: 130px;
    height: 30px;
  }
`