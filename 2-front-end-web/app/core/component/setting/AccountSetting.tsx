import React, { useState } from 'react'
import styled from 'styled-components'
import { useMutation } from '@tanstack/react-query'
import { globalColors } from '~/common/style/global-colors'
import { useUserState } from '~/common/store/user'
import Input from '~/common/component/atom/Input'
import { Flex, Font } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'
import VariantLinkOrButton from '~/core/component/VariantLinkOrButton'
import useOpenDialog from '~/common/hook/useOpenDialog'
import { Me } from '~/core/api/me'
import AppError from '~/common/error/AppError'

const initialFormState = {
  oldPassword: '',
  newPassword: '',
}

type AccountSettingProps = {}

function AccountSetting({ ...rest }: AccountSettingProps) {
  const { user } = useUserState()
  const [form, setForm] = useState(initialFormState)
  const openDialog = useOpenDialog()

  const reset = () => setForm(initialFormState)

  const { mutate: mutateChangePassword } = useMutation(Me.changePassword, {
    onSuccess: () => {
      openDialog('CHANGE_PASSWORD_CONFIRMED', { mode: 'OK' })
      reset()
    },
    onError: (e) => {
      const error = AppError.of(e)
      switch (error.name) {
        case 'BadRequest':
          return openDialog('INVALID_PASSWORD_LETTERS', { mode: 'OK' })
        case 'Forbidden':
          return openDialog('WRONG_PASSWORD', { mode: 'OK' })
        default:
          throw error
      }
    },
  })

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.oldPassword.trim() || !form.newPassword.trim()) return
    mutateChangePassword(form)
  }

  const askUnregister = () => {
    openDialog('UNREGISTER', {
      mode: 'YESNO',
      buttonTexts: {
        confirmText: '탈퇴 및 계정삭제',
        cancelText: '취소',
      },
      async onConfirm() {
        try {
          await Me.unregister()
        } catch (e) {}
        window.location.href = '/'
      },
    })
  }

  // security code
  if (!user) return null
  return (
    <Block>
      <div>
        <Title>내 계정</Title>

        <Section>
          <h4>아이디</h4>
          <Username>{user.username}</Username>
        </Section>

        <Section>
          <h4>비밀번호</h4>
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Input
                name="oldPassword"
                placeholder="현재 비밀번호"
                type="password"
                onChange={onChange}
                value={form.oldPassword}
              />

              <Input
                name="newPassword"
                placeholder="새 비밀번호"
                type="password"
                onChange={onChange}
                value={form.newPassword}
              />
            </InputGroup>

            <VariantLinkOrButton variant="primary" type="submit">
              비밀번호 변경
            </VariantLinkOrButton>
          </form>
        </Section>
      </div>

      <UnregisterWrapper>
        <VariantLinkOrButton variant="secondary" onClick={askUnregister}>
          계정 탈퇴
        </VariantLinkOrButton>
      </UnregisterWrapper>
    </Block>
  )
}
export default AccountSetting

// Inner Components

const Title = styled.h1`
  ${Font.style()
    .size(48)
    .weight(800)
    .color(globalColors.grey5)
    .lineHeight(1.5)
    .create()};
  margin-top: 0;
  margin-bottom: 32px;
`

const Block = styled.div`
  ${Flex.item().flex(1).create()};
  ${Flex.container()
    .direction('column')
    .justifyContent('space-between')
    .create()};
  padding: 16px;
  ${Media.minWidth.mobile} {
    ${Flex.item().flex('initial').create()};
    width: 100%;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 96px;
  }
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
  ${Media.minWidth.mobile} {
    width: 460px;
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

const UnregisterWrapper = styled.div`
  ${Media.minWidth.mobile} {
    margin-top: 96px;
  }
`
