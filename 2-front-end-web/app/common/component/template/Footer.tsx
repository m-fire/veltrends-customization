import React from 'react'
import styled from 'styled-components'
import { colors } from '~/core/style/colors'
import IconLink from '~/common/component/atom/IconLink'
import { Flex } from '~/common/style/css-builder'
import { screen } from '~/common/style/media-query'

type FooterProps = {}

function Footer({}: FooterProps) {
  return (
    <Block>
      <IconLink to="/" icon="home" />
      <IconLink to="/search" icon="search" />

      <IconLink to="/write" icon="add" theme="circle-stroke" />

      <IconLink to="/bookmarks" icon="bookmarks" />
      <IconLink to="/setting" icon="setting" />
    </Block>
  )
}
export default Footer

// Inner Components

const Block = styled.footer`
  ${Flex.Container.style().create()};
  height: 56px;
  border-top: 1px solid ${colors.grey1};
  ${screen.min_w.desktop} {
    // 데스크탑/모바일 스크린사이즈에 따라 보여짐/사라짐
    display: none;
  }
`
