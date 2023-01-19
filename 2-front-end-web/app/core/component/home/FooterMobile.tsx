import React from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { Filters, Flex } from '~/common/style/css-builder'
import { RoutePath } from '~/common/api/client'
import { Media } from '~/common/style/media-query'
import { PseudoThemeType } from '~/core/style/decorate-styles'
import FooterMenuItem, {
  FooterMenuItemProps,
} from '~/core/component/home/FooterMenuItem'
import {
  Bookmarks,
  Fire,
  Plus,
  Search,
  Setting,
} from '~/core/component/generate/svg'

type FooterProps = {}

export const initialItems: {
  name: string
  to: RoutePath
  icon: FooterMenuItemProps['icon']
  decorate?: PseudoThemeType
}[] = [
  { name: 'home', to: '/', icon: <Fire /> },
  { name: 'search', to: '/search', icon: <Search /> },
  { name: 'write', to: '/write', icon: <Plus />, decorate: 'circleStroke' },
  { name: 'bookmarks', to: '/bookmarks', icon: <Bookmarks /> },
  { name: 'setting', to: '/setting', icon: <Setting /> },
]

function FooterMobile({}: FooterProps) {
  return (
    <Block>
      {initialItems.map((c) => (
        <FooterMenuItem
          key={c.name}
          to={c.to}
          icon={c.icon}
          decorate={c.decorate}
        />
      ))}
    </Block>
  )
}
export default FooterMobile

// Inner Components

const Block = styled.footer`
  ${Flex.container().create()};
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 56px;
  //background-color: white;
  border-top: 1px solid ${globalColors.grey1};
  ${Media.minWidth.mobile} {
    padding-left: 15%;
    padding-right: 15%;
  }
  ${Media.minWidth.tablet} {
    display: none;
  }
  ${Filters.backdrop().grayscale(100).brightness(180).blur(16).create()};
`
