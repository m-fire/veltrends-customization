import React, { ReactNode } from 'react'
import { Item } from '~/common/api/types'
import styled from 'styled-components'
import LinkCard from '~/components/home/LinkCard'

type LinkCardListProps = {
  items: Item[]
}

function LinkCardList({ items }: LinkCardListProps) {
  return (
    <List>
      {items.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </List>
  )
}
export default LinkCardList

// Inner Components

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 72px;
  &:last-child {
    margin-bottom: 72px;
  }
`
