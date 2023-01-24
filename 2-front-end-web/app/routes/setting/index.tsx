import React from 'react'
import styled, { css } from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { useLogout } from '~/core/hook/auth/useLogout'
import { Link } from '@remix-run/react'
import { Font } from '~/common/style/css-builder'
import TabLayout from '~/core/component/home/TabLayout'

type SettingIndexProps = {}

function SettingIndex({}: SettingIndexProps) {
  const logout = useLogout()

  return (
    <TabLayout>
      <Block>
        <ListWrapper>
          <ListItemLink to="/setting/account">내 계정</ListItemLink>
          <ListItem onClick={logout}>로그아웃</ListItem>
        </ListWrapper>
      </Block>
    </TabLayout>
  )
}
export default SettingIndex

// Inner Components

const Block = styled.div`
  background: ${globalColors.grey1};
  flex: 1;
`

const ListWrapper = styled.div`
  * + div {
    border-top: 1px solid ${globalColors.grey1};
  }
`

const listItemStyle = css`
  ${Font.style()
    .color(globalColors.grey5)
    .weight(800)
    .textDecoration('none')
    .create()};
  padding: 16px;
  background: white;
  &:active {
    opacity: 0.7;
  }
`

const ListItem = styled.div`
  ${listItemStyle};
`

const ListItemLink = styled(Link)`
  display: block;
  ${listItemStyle};
`
