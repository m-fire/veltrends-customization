import React from 'react'
import { useUserState } from '~/common/store/user'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import Input from '~/common/component/atom/Input'
import VariantLinkOrButton from '~/core/component/VariantLinkOrButton'
import { Flex, Font } from '~/common/style/css-builder'
import { appColors } from '~/core/style/app-colors'

type AccountSettingProps = {}

function AccountSetting({ ...rest }: AccountSettingProps) {
  const { user } = useUserState()
  if (!user) return null

  return (
    <Block>
      <div>
        <Section>
          <h4>아이디</h4>

          <Username>{user.username}</Username>
        </Section>

        <Section>
          <h4>비밀번호</h4>

          <InputGroup>
            <Input placeholder="현재 비밀번호" type="password" />
            <Input placeholder="새 비밀번호 비밀번호" type="password" />
          </InputGroup>

          <VariantLinkOrButton variant="primary">
            비밀번호 변경
          </VariantLinkOrButton>
        </Section>
      </div>
      <div>
        <VariantLinkOrButton variant="secondary" layout="fullWidth">
          계정 탈퇴
        </VariantLinkOrButton>
      </div>
    </Block>
  )
}
export default AccountSetting

// Inner Components

const Block = styled.div`
  ${Flex.item().flex(1).create()};
  ${Flex.container()
    .direction('column')
    .justifyContent('space-between')
    .create()};
  padding: 16px;
`

const Section = styled.section`
  h4 {
    ${Font.style().size(16).color(globalColors.grey3).create()};
    margin-top: 0;
    margin-bottom: 8px;
  }
  & + & {
    margin-top: 32px;
  }
`

const Username = styled.div`
  ${Font.style().size(16).color(globalColors.grey5).create()};
`

const InputGroup = styled.div`
  ${Flex.container().direction('column').create()};
  gap: 8px;
  margin-bottom: 8px;
`
