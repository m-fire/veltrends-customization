import React, { KeyboardEventHandler, ReactNode, useRef } from 'react'
import styled from 'styled-components'
import { colors } from '~/core/style/colors'
import Search from '~/core/component/generate/svg/Search'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { useNavigate, useSearchParams } from '@remix-run/react'

type SearchAreaProps = {}

function SearchArea({}: SearchAreaProps) {
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
        <Search />
        <input ref={ref} defaultValue={initailSearchKeyword} />
      </SearchInputWrapper>
    </Block>
  )
}
export default SearchArea

// Inner Components

const Block = styled.div``

const SearchInputWrapper = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  background-color: ${colors.grey1};
  width: 180px;
  height: 36px;
  //border: 2px solid white;
  border-radius: 6px;
  padding-left: 8px;
  padding-right: 14px;
  margin-right: 8px;
  & > svg {
    ${Flex.Item.style().shrink(0).create()};
    width: 18px;
    height: 18px;
    color: ${colors.primary1};
    margin-right: 8px;
    ${Filters.filter()
      .dropShadow(0, 0, 1, 'white')
      .dropShadow(0, 0, 1, 'white')
      .create()};
  }
  input {
    ${Flex.Item.flex1};
    ${Font.style().size(18).weight(700).color(colors.grey5).create()};
    background: none;
    border: none;
    outline: none;
    min-width: 0;
    ${Filters.filter().dropShadow(0, 0, 1, colors.primary1).create()};
  }
`
