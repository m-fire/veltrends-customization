import React, { useState } from 'react'
import styled from 'styled-components'
import TabLayout from '~/common/component/layout/TabLayout'
import Header from '~/common/component/base/Header'
import SearchInput from '~/core/component/search/SearchInput'

function Search() {
  const [searchText, setSearchText] = useState('')

  return (
    <TabLayout
      header={
        <StyledHeader
          title={
            <SearchInput value={searchText} onChangeText={setSearchText} />
          }
        />
      }
    />
  )
}
export default Search

// Inner Components

const StyledHeader = styled(Header)`
  & > .title {
    width: 100%;
  }
`
