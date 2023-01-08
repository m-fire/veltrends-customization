import React, { createElement } from 'react'
import { NavLink } from '@remix-run/react'
import styled, { css } from 'styled-components'
import { colors } from '~/core/style/colors'
import { RoutePath } from '~/common/api/client'
import {
  Bookmarks,
  Fire,
  Plus,
  Search,
  Setting,
} from '~/core/component/generate/svg'
import { Flex } from '~/common/style/css-builder'

const iconMap = {
  home: Fire,
  search: Search,
  add: Plus,
  bookmarks: Bookmarks,
  setting: Setting,
}

type ThemeType = 'circle-stroke'

type IconLinkProps = {
  to: RoutePath
  icon: keyof typeof iconMap
  theme?: ThemeType
}

function IconLink({ to, icon, theme }: IconLinkProps) {
  const iconEl = createElement(iconMap[icon])

  return (
    <NavLinkItemRef
      to={to}
      className={({ isActive }) => (isActive ? 'active' : '')}
      theme={theme}
    >
      {iconEl}
    </NavLinkItemRef>
  )
}
export default IconLink

// Inner Components

const NavLinkItemRef = styled(NavLink)<Partial<IconLinkProps>>`
  ${Flex.Item.flex1};
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('center')
    .create()};
  position: relative;
  svg {
    color: ${colors.grey5};
    width: 24px;
    height: 24px;
  }
  &.active {
    svg {
      color: ${colors.primary1};
    }
  }
  ${({ theme }) => {
    switch (theme) {
      case 'circle-stroke':
        return themeCircleStroke()
      // case 'another-theme':
      //   return pseudoThemeName()
      default:
        return undefined
    }
  }}
`

function themeCircleStroke() {
  return css`
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 5px solid ${colors.grey1};
      z-index: -1;
    }
    &.active {
      &::before {
        border: 3px solid ${colors.primary1};
        background-color: ${colors.primary6};
      }
    }
  `
}

// function themeAnotherTheme() {
//   return css`
//     &::before {
//       content: '';
//       display: block;
//       position: absolute;
//       width: 40px;
//       height: 40px;
//       border-radius: 999px;
//       border: 5px solid ${colors.grey1};
//       z-index: -1;
//     }
//     &.active {
//       &::before {
//         border: 3px solid ${colors.primary1};
//         background-color: ${colors.primary6};
//       }
//     }
//   `
// }
