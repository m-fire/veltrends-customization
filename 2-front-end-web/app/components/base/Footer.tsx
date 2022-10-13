import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import FooterTabItem from '~/components/base/FooterTabItem'

const paths = ['search', 'bookmarks', 'setting'] as const

function isValidPath(path: any): path is typeof paths[number] {
  return paths.includes(path)
}

type FooterProps = {}

function Footer({}: FooterProps) {
  return (
    <StyledFooter>
      <FooterTabItem icon="home" to="/" />
      <FooterTabItem icon="search" to="/search" />

      <FooterTabItem icon="add" />

      <FooterTabItem icon="bookmarks" to="/bookmarks" />
      <FooterTabItem icon="setting" to="/setting" />
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
