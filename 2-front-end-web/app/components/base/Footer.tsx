import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import FooterTabItem from '~/components/base/FooterTabItem'

type FooterProps = {}

function Footer({}: FooterProps) {
  return (
    <StyledFooter>
      <FooterTabItem icon="home" />
      <FooterTabItem icon="search" />
      <FooterTabItem icon="add" />
      <FooterTabItem icon="bookmark" />
      <FooterTabItem icon="setting" />
    </StyledFooter>
  )
}
export default Footer

// Inner Components

const StyledFooter = styled.footer`
  height: 56px;
  border-top: 1px solid ${colors.grey1};
  display: flex;
`
