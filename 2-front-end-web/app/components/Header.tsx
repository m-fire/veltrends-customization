import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import SvgLogoVeltrend from '~/components/generate/LogoVeltrend'

// Common Block
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

type HeaderProps = {}

function Header({}: HeaderProps) {
  return (
    <Block>
      <SvgLogoVeltrend />
    </Block>
  )
}

Header.defaultProps = {
  // initial prop values
} as HeaderProps

export default Header
