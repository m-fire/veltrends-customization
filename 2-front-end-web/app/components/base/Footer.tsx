import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import FooterTabItem from '~/components/base/FooterTabItem'
import { flexStyles } from '~/common/style/styled'

const paths = ['search', 'bookmarks', 'setting'] as const

function isValidPath(path: any): path is typeof paths[number] {
  return paths.includes(path)
}

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
  ${flexStyles()};
  height: 56px;
  border-top: 1px solid ${colors.grey1};
`
