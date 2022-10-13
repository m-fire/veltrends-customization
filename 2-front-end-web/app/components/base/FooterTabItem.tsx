import React, { createElement } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'
import {
  Bookmark,
  Fire,
  Plus,
  Search,
  Setting,
} from '~/components/generate/svg'
import { Link } from '@remix-run/react'

const iconMap = {
  home: Fire,
  search: Search,
  add: Plus,
  bookmark: Bookmark,
  setting: Setting,
}

type FooterTabItemProps = {
  icon: keyof typeof iconMap
  isActive?: boolean
  to?: string
}

function FooterTabItem({ icon, isActive, to }: FooterTabItemProps) {
  const iconEl = createElement(iconMap[icon])

  if (to) {
    return (
      <LinkItemRef to={to} isActive={isActive}>
        {iconEl}
      </LinkItemRef>
    )
  }

  return <ButtonItem isActive={isActive}>{iconEl}</ButtonItem>
}
export default FooterTabItem

// Inner Components

const LinkItemRef = styled(Link)<Pick<FooterTabItemProps, 'isActive'>>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${colors.grey5};
    width: 24px;
    height: 24px;
    ${({ isActive }) =>
      isActive &&
      css`
        color: ${colors.primary1};
      `}
  }
`

const ButtonItem = styled.button<Pick<FooterTabItemProps, 'isActive'>>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${colors.grey5};
    width: 24px;
    height: 24px;
    ${({ isActive }) =>
      isActive &&
      css`
        color: ${colors.primary1};
      `}
  }
`
