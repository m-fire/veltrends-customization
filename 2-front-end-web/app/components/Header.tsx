import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import SvgLogoVeltrend from '~/components/generate/LogoVeltrend'

type HeaderProps = {
  title?: ReactNode
}

function Header({ title = <SvgLogoVeltrend /> }: HeaderProps) {
  return (
    <Block>
      <Title>{title}</Title>
    </Block>
  )
}

export default Header

// Sub Comps

const Block = styled.header`
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
