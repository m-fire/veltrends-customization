import React from 'react'
import { SearchedItem } from '~/core/api/types'
import styled from 'styled-components'
import { flexStyles } from '~/common/style/styled'
import SearchResultCard from '~/core/component/search/SearchResultCard'

type SearchResultCardListProps = {
  list: SearchedItem[]
}

function SearchResultCardList({ list }: SearchResultCardListProps) {
  return (
    <Block>
      {list.map((item) => (
        <SearchResultCard key={item.id} item={item} />
      ))}
    </Block>
  )
}
export default SearchResultCardList

// Inner Components

const Block = styled.div`
  ${flexStyles({ direction: 'column' })};
  padding: 24px 16px;
  gap: 24px;
`
