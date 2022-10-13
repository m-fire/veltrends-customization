import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'

type FooterTabItemProps = {}

function FooterTabItem({}: FooterTabItemProps) {
  return (
    <>
      <Item>Item</Item>
    </>
  )
}
export default FooterTabItem

// Inner Components

const Item = styled.div`
  border: 1px solid ${colors.grey1};
  background-color: gray;
`
