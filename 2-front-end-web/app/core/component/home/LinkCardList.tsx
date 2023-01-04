import React, { ReactNode } from 'react'
import { Item } from '~/core/api/types'
import styled from 'styled-components'
import LinkCard from '~/core/component/home/LinkCard'
import { flexContainer } from '~/common/style/styled'

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
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 72px;
  & > li:last-child {
    margin-bottom: 72px;
  }
`
