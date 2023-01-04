import React from 'react'
import { Item } from '~/core/api/types'
import styled from 'styled-components'
import LinkCard from '~/core/component/home/LinkCard'
import { screen } from '~/common/style/media-query'
import Grid from '~/common/style/css-grid'

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
  ${Grid.Container.style().templateColumns('repeat(1, 1fr)').create()};
  ${screen.tablet} {
    ${Grid.Container.style().templateColumns('repeat(2, 1fr)').create()};
  }
  ${screen.wide} {
    ${Grid.Container.style().templateColumns('repeat(3, 1fr)').create()};
  }
  row-gap: 56px;
  column-gap: 30px;

  & > li:last-child {
    margin-bottom: 72px;
  }
`
