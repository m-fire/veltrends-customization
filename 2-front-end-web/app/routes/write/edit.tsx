import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import styled from 'styled-components'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { colors } from '~/common/style/colors'
import BasicLayout from '~/common/component/layout/BasicLayout'
import WriteFormTemplate from '~/core/component/write/WriteFormTemplate'
import LabelInput from '~/common/component/system/LabelInput'
import LabelTextArea from '~/common/component/system/LabelTextArea'

function Edit() {
  const [form, setForm] = useState({})

  const onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    e,
  ) => {
    const formKey = e.target.name as keyof typeof form
    const text = e.target.value
    setForm({ ...form, [formKey]: text })
  }

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault()
  }

  const errorMessage = null

  return (
    <BasicLayout title="수정" hasBackButton>
      <WriteFormTemplate buttonText="수정하기" onSubmit={onSubmit}>
        <Group>
          <LinkLabelTextArea label="URL" name="link" onChange={onChange} />

          <LabelInput label="제목" name="title" onChange={onChange} />

          <BodyLabelTextArea label="내용" name="body" onChange={onChange} />

          {errorMessage ? <Message>{errorMessage}</Message> : null}
        </Group>
      </WriteFormTemplate>
    </BasicLayout>
  )
}
export default Edit

// Inner Components

const Group = styled.div`
  ${flexStyles({ direction: 'column', flex: 1 })};
  gap: 16px;
  padding-bottom: 16px;
`

const LinkLabelTextArea = styled(LabelTextArea)`
  & textarea {
    ${fontStyles({ size: '14px' })};
    padding: 8px;
  }
`

const BodyLabelTextArea = styled(LabelTextArea)`
  flex: 1;
  textarea {
    flex: 1;
    resize: none;
    font-family: inherit;
  }
`

const Message = styled.div`
  ${fontStyles({ size: '14px', color: colors.secondary1 })};
  margin-top: 8px;
  text-align: center;
`
