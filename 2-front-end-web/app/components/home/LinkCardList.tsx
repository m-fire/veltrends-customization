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
      LinkCadd List
      {items.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </List>
  )
}
export default LinkCardList

// Inner Components

const List = styled.div`
  display: flex;
  flex-direction: column;
`
