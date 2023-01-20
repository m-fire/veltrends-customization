import React from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'

type SettingIndexProps = {}

function SettingIndex({}: SettingIndexProps) {
  return (
    <Block>
      <ListWrapper>
        <ListItem>내 계정</ListItem>
        <ListItem>로그아웃</ListItem>
      </ListWrapper>
    </Block>
  )
}
export default SettingIndex

// Inner Components

const Block = styled.div`
  background: ${globalColors.grey1};
  flex: 1;
`

const ListWrapper = styled.div`
  div + div {
    border-top: 1px solid ${globalColors.grey1};
  }
`

const ListItem = styled.div`
  padding: 16px;
  background: white;
  &:active {
    opacity: 0.7;
  }
`
