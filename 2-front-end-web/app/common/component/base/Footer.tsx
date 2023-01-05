import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import FooterTabItem from '~/common/component/base/FooterTabItem'
import Flex from '~/common/style/css-flex'

//Todo: 데스크탑/모바일 스크린사이즈에 따라 보여짐/사라짐 구현
type FooterProps = {}

function Footer({}: FooterProps) {
  return (
    <StyledFooter>
      <FooterTabItem to="/" icon="home" />
      <FooterTabItem to="/search" icon="search" />

      <FooterTabItem to="/write" icon="add" theme="circle-stroke" />

      <FooterTabItem to="/bookmarks" icon="bookmarks" />
      <FooterTabItem to="/setting" icon="setting" />
    </StyledFooter>
  )
}
export default Footer

// Inner Components

const StyledFooter = styled.footer`
  ${Flex.Container.style().create()};
  height: 56px;
  border-top: 1px solid ${colors.grey1};
`
