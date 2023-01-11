import React from 'react'
import { SearchedItem } from '~/core/api/types'
import styled from 'styled-components'
import SearchResultCard from '~/core/component/routes/search/SearchResultCard'
import { Flex } from '~/common/style/css-builder'

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
  ${Flex.Container.style().direction('column').create()};
  padding: 24px 16px;
  gap: 24px;
`
