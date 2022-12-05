import React, { useState } from 'react'
import styled from 'styled-components'
import TabLayout from '~/common/component/layout/TabLayout'
import Header from '~/common/component/base/Header'
import SearchInput from '~/core/component/search/SearchInput'
import { useDebounce } from 'use-debounce'

function Search() {
  const [searchText, setSearchText] = useState('')
  // searchText 변경시 값 변동이 없는 상태에서 딜레이 이후 debouncedSearchText 값 변경
  const [debouncedSearchText] = useDebounce(searchText, 600)

  return (
    <TabLayout
      header={
        <StyledHeader
          title={
            <SearchInput value={searchText} onChangeText={setSearchText} />
          }
        />
      }
    >
      {debouncedSearchText}
    </TabLayout>
  )
}
export default Search

// Inner Components

const StyledHeader = styled(Header)`
  & > .title {
    width: 100%;
  }
`
