import { useState } from 'react'
import { useFetcher } from '@remix-run/react'
import styled from 'styled-components'
import LabelInput from '~/components/system/LabelInput'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import LabelTextArea from '~/components/system/LabelTextArea'
import { Authenticator } from '~/common/api/auth'
import { createItem } from '~/common/api/items'
import { useWriteContext } from '~/context/WriteContext'

type IntroProps = {}

function Intro({}: IntroProps) {
  const {
    state: { link },
  } = useWriteContext()
  const initialForm = { title: '', body: '' }
  const [form, setForm] = useState(initialForm)

  /* Remix submitting hooks */
  const fetcher = useFetcher<typeof initialForm>()

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요."
        buttonText="등록하기"
        onSubmit={(e) => {
          e.preventDefault()
          fetcher.submit({ link, ...form }, { method: 'post' })
          console.log(`Intro.onSubmit() fetcher.submit()`)
        }}
      >
        <Group>
          <LabelInput
            label="제목"
            name="title"
            onChange={(e) => {
              const key = e.target.name
              const { value } = e.target
              setForm({ ...form, [key]: value })
            }}
            value={form.title}
          />
          <IntroLabelTextArea
            label="내용"
            name="body"
            onChange={(e) => {
              const key = e.target.name
              const { value } = e.target
              setForm({
                ...form,
                [key]: value,
              })
            }}
            value={form.body}
          />
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
