import { useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { ActionFunction, redirect } from '@remix-run/node'
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
    state: { form },
    actions,
  } = useWriteContext()
  const initialForm = { title: '', body: '' }
  const [form, setForm] = useState(initialForm)

  /* Remix submitting hooks */
  const fetcher = useFetcher<typeof initialForm>()

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    e,
  ) => {
    const key = e.target.name as keyof Omit<typeof form, 'link'>
    const { value } = e.target
    actions.change(key, value)
  }

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요."
        buttonText="등록하기"
        onSubmit={async (e) => {
          e.preventDefault()
          fetcher.submit(form, { method: 'post' })
        }}
      >
        <Group>
          <LabelInput
            label="제목"
            name="title"
            onChange={onChange}
            value={form.title}
          />
          <IntroLabelTextArea
            label="내용"
            name="body"
            onChange={onChange}
            value={form.body}
          />
        </Group>
      </WriteFormTemplate>
    </BasicLayout>
  )
}
export default Intro

/* Remix routes handler */

export const action: ActionFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkAuthenticated(request)
  if (!isAuthenticated) throw new Error('Not logged in')

  const form = await request.formData()

  const link = form.get('link') as string
  const title = form.get('title') as string
  const body = form.get('body') as string
  try {
    await createItem({ link, title, body })

    return redirect('/')
  } catch (e) {
    // ...
  }
}

  return redirect('/')
}

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
