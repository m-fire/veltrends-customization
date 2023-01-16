import React from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { Flex } from '~/common/style/css-builder'
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

export const initialItemConfigs: {
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
      {initialItemConfigs.map((c) => (
        <FooterMenuItem
          key={c.name}
          to={c.to}
          icon={c.icon}
          $decorateType={c.decorate}
        />
      ))}
    </Block>
  )
}
export default FooterMobile

// Inner Components

const Block = styled.footer`
  ${Flex.container().create()};
  position: relative;
  height: 56px;
  background-color: white;
  transform: translateY(-100%);
  border-top: 1px solid ${globalColors.grey1};
  ${Media.minWidth.desktop} {
    display: none;
  }
`
