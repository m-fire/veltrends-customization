import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import SvgLogoVeltrend from '~/components/generate/LogoVeltrend'

type HeaderProps = {
  title?: ReactNode
}

function Header({ title = <SvgLogoVeltrend /> }: HeaderProps) {
  return <Block>{title}</Block>
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
  svg {
    color: ${colors.grey6};
    width: 130px;
    height: 30px;
  }
`
