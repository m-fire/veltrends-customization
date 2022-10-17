import { FormEventHandler } from 'react'
import styled from 'styled-components'
import LabelInput from '~/components/system/LabelInput'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import LabelTextArea from '~/components/system/LabelTextArea'

function Intro() {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const body = formData.get('body') as string
    console.log(title, body)
  }

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요."
        buttonText="등록하기"
        onSubmit={onSubmit}
      >
        <Group>
          <LabelInput label="제목" name="title" />
          <IntroLabelTextArea label="내용" name="body" />
        </Group>
      </WriteFormTemplate>
    </BasicLayout>
  )
}
export default Intro

// Inner Components

const Group = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  padding-bottom: 16px;
`

const IntroLabelTextArea = styled(LabelTextArea)`
  flex: 1;
  textarea {
    flex: 1;
    resize: none;
    font-family: inherit;
  }
`
