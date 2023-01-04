import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { Search } from '~/core/component/generate/svg'
import { flexContainer, fontStyles } from '~/common/style/styled'

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
  ${flexContainer({ alignItems: 'center' })};
  box-sizing: content-box; // 전역 border-box 설정해제
  height: 40px;
  border-radius: 4px;
  border: 2px solid ${colors.primary1};
  margin-left: 4px;
  margin-right: 4px;
  padding-left: 12px;
  padding-right: 12px;
  input {
    // input tag 초기화
    background: none;
    border: none;
    outline: none;
    ${fontStyles({ size: '16px' })};
    flex: 1; // grow:1, shrink:1, basis:0%
    margin-left: 8px;
    margin-right: 8px;
    &::placeholder {
      color: ${colors.grey1};
    }
  }
  svg {
    color: ${colors.primary1};
    width: 20px;
    height: 20px;
  }
`
