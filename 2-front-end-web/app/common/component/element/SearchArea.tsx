import React, { KeyboardEventHandler, ReactNode, useRef } from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { useNavigate, useSearchParams } from '@remix-run/react'

type SearchAreaProps = {
  searchIcon: ReactNode
}

function SearchArea({ searchIcon }: SearchAreaProps) {
  const [searchParams] = useSearchParams()

  const ref = useRef<HTMLInputElement>(null)
  const onClick = () => {
    ref.current?.focus()
  }

  const nevigate = useNavigate()
  const onKeyUp: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      const trimedText = ref.current?.value.trim()
      if (!trimedText) return

      alert(trimedText)
      nevigate(`/search?q=${trimedText}`)
    }
  }

  const initailSearchKeyword = searchParams.get('q') ?? ''
  return (
    <Block>
      <SearchInputWrapper onClick={onClick} onKeyUp={onKeyUp}>
        {searchIcon}
        <input ref={ref} defaultValue={initailSearchKeyword} />
      </SearchInputWrapper>
    </Block>
  )
}
export default SearchArea

// Inner Components

const Block = styled.div``

const SearchInputWrapper = styled.div`
  ${Flex.container().alignItems('center').create()};
  background-color: ${globalColors.grey1};
  width: 180px;
  height: 36px;
  //border: 2px solid white;
  border-radius: 6px;
  padding-left: 8px;
  padding-right: 14px;
  & > svg {
    ${Flex.item().shrink(0).create()};
    width: 18px;
    height: 18px;
    color: ${appColors.primary1};
    margin-right: 8px;
    ${Filters.filter()
      .dropShadow(0, 0, 1, 'white')
      .dropShadow(0, 0, 1, 'white')
      .create()};
  }
  input {
    ${Flex.item().flex(1).create()};
    ${Font.style().size(18).weight(700).color(globalColors.grey5).create()};
    background: none;
    border: none;
    outline: none;
    min-width: 0;
    ${Filters.filter().dropShadow(0, 0, 1, appColors.primary1).create()};
  }
`
