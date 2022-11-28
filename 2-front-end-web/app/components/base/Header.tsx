import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { LogoVeltrend } from '~/components/generate/svg'
import { flexStyles, fontStyles } from '~/common/style/styled'

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
      {headerLeft ? (
        <HeaderSide position={'left'}>{headerLeft}</HeaderSide>
      ) : null}
      <Title>{title}</Title>
      {headerRight ? (
        <HeaderSide position={'right'}>{headerRight}</HeaderSide>
      ) : null}
    </Block>
  )
}

export default Header

// Sub Comps

const HeaderSide = styled.div<{ position: 'left' | 'right' }>`
  ${flexStyles({ alignItems: 'center' })};
  position: absolute;
  ${(props) => props.position}: 16px;
  top: 0;
  height: 100%;
`

const Block = styled.header`
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })};
  position: relative;
  height: 56px;
  border-bottom: 1px solid ${colors.grey1};
  padding-left: 16px;
  padding-right: 16px;
`

const Title = styled.div`
  ${fontStyles({ size: '20px', weight: 800, color: colors.grey5 })};
  svg {
    display: block;
    width: 130px;
    height: 30px;
  }
`
