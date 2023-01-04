import React from 'react'
import { SearchedItem } from '~/core/api/types'
import styled from 'styled-components'
import { flexContainer } from '~/common/style/styled'
import SearchResultCard from '~/core/component/search/SearchResultCard'

type SearchResultCardListProps = {
  list: SearchedItem[]
}

function SearchResultCardList({ list }: SearchResultCardListProps) {
  return (
    <ResultContainer>
      {list.map((item) => (
        <SearchResultCard key={item.id} item={item} />
      ))}
    </ResultContainer>
  )
}
export default SearchResultCardList

// Inner Components

const ResultContainer = styled.div`
  ${flexContainer({ direction: 'column' })};
  padding: 24px 16px;
  gap: 24px;
`
