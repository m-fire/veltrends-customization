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
}

function FooterTabItem({ icon, isActive }: FooterTabItemProps) {
  const iconEl = createElement(iconMap[icon])
  return (
    <>
      <Item isActive={isActive}>{iconEl}</Item>
    </>
  )
}
export default FooterTabItem

// Inner Components

const Item = styled.div<Pick<FooterTabItemProps, 'isActive'>>`
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
