import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Item } from '~/common/api/types'

type LinkCardProps = {
  item: Item
}

function LinkCard({}: LinkCardProps) {
  return <Block>LinkCadd Item</Block>
}
export default LinkCard

// Inner Components

const Block = styled.section`
  display: flex;
  flex-direction: column;
`
