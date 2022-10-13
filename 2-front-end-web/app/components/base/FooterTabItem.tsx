import React, { createElement } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'
import {
  Bookmarks,
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
  bookmarks: Bookmarks,
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

const sharedStyle = (isActive?: boolean) => css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${colors.grey5};
    width: 24px;
    height: 24px;
    ${isActive &&
    css`
      color: ${colors.primary1};
    `}
  }
`

const LinkItemRef = styled(Link)<Pick<FooterTabItemProps, 'isActive'>>`
  ${({ isActive }) => sharedStyle(isActive)}
`

const decoShapeCircleStyle = (isActive?: boolean) => css`
  &::after {
    display: block;
    position: absolute;
    width: 44px;
    height: 44px;
    content: '';
    border: 2px solid ${isActive ? colors.primary1 : colors.grey5};
    border-radius: 999px;
  }
`
const ButtonItem = styled.button<Pick<FooterTabItemProps, 'isActive'>>`
  background: none;
  outline: none;
  border: none;
  position: relative;
  ${({ isActive }) => [
    ...sharedStyle(isActive),
    ...decoShapeCircleStyle(isActive),
  ]};
`
