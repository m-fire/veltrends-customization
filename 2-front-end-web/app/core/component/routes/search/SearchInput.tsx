import React from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { Search } from '~/core/component/generate/svg'
import { Flex, Font } from '~/common/style/css-builder'

export type SearchInputProps = {
  value: string
  onChangeText: (text: string) => void
}

function SearchInput({ value, onChangeText }: SearchInputProps) {
  return (
    <Block>
      <input
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <Search />
    </Block>
  )
}
export default SearchInput

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  box-sizing: content-box; // 전역 border-box 설정해제
  height: 40px;
  border-radius: 4px;
  border: 2px solid ${appColors.primary1};
  margin-left: 4px;
  margin-right: 4px;
  padding-left: 12px;
  padding-right: 12px;
  input {
    // input tag 초기화
    ${Flex.Item.flex1};
    background: none;
    border: none;
    outline: none;
    ${Font.style().size('16px').create()};
    margin-left: 8px;
    margin-right: 8px;
    &::placeholder {
      color: ${globalColors.grey1};
    }
  }
  svg {
    color: ${appColors.primary1};
    width: 20px;
    height: 20px;
  }
`
