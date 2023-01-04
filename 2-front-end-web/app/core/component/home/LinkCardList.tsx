import React from 'react'
import { Item } from '~/core/api/types'
import styled from 'styled-components'
import LinkCard from '~/core/component/home/LinkCard'
import { gridContiner } from '~/common/style/styled'
import { screen } from '~/common/style/media-query'

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
  ${gridContiner({
    templateColumns: 'repeat(1, 1fr)',
  })}
  ${screen.tablet} {
    ${gridContiner({
      templateColumns: 'repeat(2, 1fr)',
    })}
  }
  ${screen.wide} {
    ${gridContiner({
      templateColumns: 'repeat(3, 1fr)',
    })}
  }
  row-gap: 56px;
  column-gap: 30px;

  & > li:last-child {
    margin-bottom: 72px;
  }
`
