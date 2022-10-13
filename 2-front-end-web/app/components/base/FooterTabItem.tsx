import React, { createElement, MouseEventHandler } from 'react'
import { NavLink } from '@remix-run/react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'
import {
  Bookmarks,
  Fire,
  Plus,
  Search,
  Setting,
} from '~/components/generate/svg'

const iconMap = {
  home: Fire,
  search: Search,
  add: Plus,
  bookmarks: Bookmarks,
  setting: Setting,
}

type FooterTabItemProps = {
  to?: string
  icon: keyof typeof iconMap
}

function FooterTabItem({ to, icon }: FooterTabItemProps) {
  const iconEl = createElement(iconMap[icon])

  /* render NavLink */

  if (to) {
    return (
      <NavLinkItemRef
        to={to}
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        {iconEl}
      </NavLinkItemRef>
    )
  }

  /* render Button */

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.classList.toggle('active')
  }
  return <ButtonItem onClick={handleClick}>{iconEl}</ButtonItem>
}
export default FooterTabItem

// Inner Components

const NavLinkItemRef = styled(NavLink)`
  ${sharedStyle()}
`

const ButtonItem = styled.button`
  background: none;
  outline: none;
  border: none;
  position: relative;
  ${[...sharedStyle(), ...shapeDecoStyle()]};
  &.active {
    &::after {
      border: 4px solid ${colors.primary5};
    }
  }
`

function sharedStyle() {
  return css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
  `
}

function shapeDecoStyle() {
  return css`
    &::after {
      display: block;
      position: absolute;
      width: 44px;
      height: 44px;
      content: '';
      border: 4px solid ${colors.grey1};
      border-radius: 999px;
    }
  `
}
